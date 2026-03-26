package com.example.ems.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class RoleBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		boolean isAdmin = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.anyMatch(a -> a.equals("ROLE_ADMIN"));

		if (isAdmin) {
			response.sendRedirect(request.getContextPath() + "/");
		} else {
			response.sendRedirect(request.getContextPath() + "/employees/me");
		}
	}
}

