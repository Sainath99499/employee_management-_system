package com.example.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.ems.model.Employee;
import com.example.ems.service.CurrentUserService;
import com.example.ems.service.EmployeeService;
import com.example.ems.service.FileStorageService;

@Controller
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private FileStorageService fileStorageService;

	@Autowired
	private CurrentUserService currentUserService;

	// display list of employees
	@GetMapping("/")
	public String viewHomePage(Model model) {
		return findPaginated(1, model);
	}

	@GetMapping("/page/{pageNo}")
	public String findPaginated(@PathVariable("pageNo") int pageNo, Model model) {
		int pageSize = 10;
		Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
		Page<Employee> page = employeeService.findPaginated(pageable);
		model.addAttribute("currentPage", pageNo);
		model.addAttribute("totalPages", page.getTotalPages());
		model.addAttribute("totalItems", page.getTotalElements());
		model.addAttribute("listEmployees", page.getContent());
		return "index";
	}

	@GetMapping("/showNewEmployeeForm")
	public String showNewEmployeeForm(Model model) {
		// create model attribute to bind form data
		Employee employee = new Employee();
		model.addAttribute("employee", employee);
		return "new_employee";
	}

	@PostMapping("/saveEmployee")
	public String saveEmployee(@ModelAttribute("employee") Employee employee,
			@RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
			Model model) {
		try {
			String storedUrl = fileStorageService.storeProfileImage(imageFile);
			if (storedUrl != null) {
				employee.setProfileImage(storedUrl);
			} else if (employee.getId() != 0) {
				Employee existing = employeeService.getEmployeeById(employee.getId());
				employee.setProfileImage(existing.getProfileImage());
			}
		} catch (IllegalArgumentException ex) {
			model.addAttribute("error", ex.getMessage());
			model.addAttribute("employee", employee);
			return employee.getId() == 0 ? "new_employee" : "update_employee";
		} catch (Exception ex) {
			model.addAttribute("error", "Failed to upload image.");
			model.addAttribute("employee", employee);
			return employee.getId() == 0 ? "new_employee" : "update_employee";
		}

		employeeService.saveEmployee(employee);
		return "redirect:/";
	}

	@GetMapping("/showFormForUpdate/{id}")
	public String showFormForUpdate(@PathVariable ( value = "id") long id, Model model) {
		
		// get employee from the service
		Employee employee = employeeService.getEmployeeById(id);
		
		// set employee as a model attribute to pre-populate the form
		model.addAttribute("employee", employee);
		return "update_employee";
	}

	@GetMapping("/deleteEmployee/{id}")
	public String deleteEmployee(@PathVariable (value = "id") long id) {
		
		// call delete employee method 
		this.employeeService.deleteEmployeeById(id);
		return "redirect:/";
	}

	@GetMapping("/search")
	public String searchEmployees(String keyword, String department, Double minSalary, Double maxSalary, Model model) {
		model.addAttribute("listEmployees", employeeService.searchWithFilters(keyword, department, minSalary, maxSalary));
		model.addAttribute("keyword", keyword);
		model.addAttribute("department", department);
		model.addAttribute("minSalary", minSalary);
		model.addAttribute("maxSalary", maxSalary);
		return "index";
	}

	@GetMapping("/employees/{id}")
	public String viewEmployeeProfile(@PathVariable("id") long id, Model model, Authentication authentication) {
		if (!isAdmin(authentication) && !currentUserService.canAccessEmployee(authentication.getName(), id)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
		Employee employee = employeeService.getEmployeeById(id);
		model.addAttribute("employee", employee);
		return "employee_profile";
	}

	@GetMapping("/employees/me")
	public String myProfile(Authentication authentication) {
		if (isAdmin(authentication)) {
			return "redirect:/";
		}
		return currentUserService.getLinkedEmployee(authentication.getName())
				.map(e -> "redirect:/employees/" + e.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "No employee record linked to this user."));
	}

	private boolean isAdmin(Authentication authentication) {
		if (authentication == null) return false;
		for (GrantedAuthority a : authentication.getAuthorities()) {
			if ("ROLE_ADMIN".equals(a.getAuthority())) {
				return true;
			}
		}
		return false;
	}
}
