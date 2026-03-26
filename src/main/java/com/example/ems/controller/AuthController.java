package com.example.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.ems.dto.RegisterRequest;
import com.example.ems.service.UserService;

@Controller
public class AuthController {
	@Autowired
	private UserService userService;

	@GetMapping("/login")
	public String login() {
		return "login";
	}

	@GetMapping("/register")
	public String register(Model model) {
		model.addAttribute("registerRequest", new RegisterRequest());
		return "register";
	}

	@PostMapping("/register")
	public String registerSubmit(@ModelAttribute("registerRequest") RegisterRequest request, Model model) {
		String username = request.getUsername();
		String password = request.getPassword();
		String confirm = request.getConfirmPassword();

		if (password == null || !password.equals(confirm)) {
			model.addAttribute("error", "Passwords do not match");
			return "register";
		}

		try {
			userService.registerEmployeeUser(username, password);
		} catch (IllegalArgumentException ex) {
			model.addAttribute("error", ex.getMessage());
			return "register";
		}

		return "redirect:/login?registered";
	}
}

