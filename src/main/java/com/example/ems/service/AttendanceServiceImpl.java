package com.example.ems.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ems.model.Attendance;
import com.example.ems.model.Employee;
import com.example.ems.repository.AttendanceRepository;

@Service
public class AttendanceServiceImpl implements AttendanceService {

	private final AttendanceRepository attendanceRepository;

	public AttendanceServiceImpl(AttendanceRepository attendanceRepository) {
		this.attendanceRepository = attendanceRepository;
	}

	@Override
	public Attendance markAttendance(Employee employee, LocalDate date, String status) {
		Attendance attendance = new Attendance(employee, date, status);
		return attendanceRepository.save(attendance);
	}

	@Override
	public List<Attendance> getAttendanceForEmployee(Employee employee) {
		return attendanceRepository.findByEmployee(employee);
	}

	@Override
	public List<Attendance> getAttendanceForEmployeeBetween(Employee employee, LocalDate startDate, LocalDate endDate) {
		return attendanceRepository.findByEmployeeAndDateBetween(employee, startDate, endDate);
	}
}

