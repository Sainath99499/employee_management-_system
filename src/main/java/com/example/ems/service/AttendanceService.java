package com.example.ems.service;

import java.time.LocalDate;
import java.util.List;

import com.example.ems.model.Attendance;
import com.example.ems.model.Employee;

public interface AttendanceService {
	Attendance markAttendance(Employee employee, LocalDate date, String status);

	List<Attendance> getAttendanceForEmployee(Employee employee);

	List<Attendance> getAttendanceForEmployeeBetween(Employee employee, LocalDate startDate, LocalDate endDate);
}

