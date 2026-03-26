package com.example.ems.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.ems.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	@Query("SELECT e FROM Employee e WHERE " +
			"LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"CAST(e.id AS string) LIKE CONCAT('%', :keyword, '%')")
	List<Employee> search(String keyword);

	List<Employee> findByDepartment(String department);

	@Query("SELECT e FROM Employee e WHERE "
			+ "(:name IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :name, '%')))"
			+ " AND (:department IS NULL OR e.department = :department)"
			+ " AND (:minSalary IS NULL OR e.salary >= :minSalary)"
			+ " AND (:maxSalary IS NULL OR e.salary <= :maxSalary)")
	List<Employee> advancedSearch(String name, String department, BigDecimal minSalary, BigDecimal maxSalary);
}
