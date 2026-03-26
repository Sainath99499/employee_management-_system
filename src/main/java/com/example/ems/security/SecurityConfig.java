package com.example.ems.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/login", "/register", "/css/**", "/js/**", "/images/**", "/uploads/**").permitAll()
						// Authenticated users (ADMIN or EMPLOYEE) can access /me and attendance
						.requestMatchers("/api/v1/me").authenticated()
						.requestMatchers("/api/v1/employees/*/attendance").authenticated()
						// Dashboard stats require ADMIN
						.requestMatchers("/api/v1/dashboard").hasRole("ADMIN")
						// All other /api/** requires ADMIN
						.requestMatchers("/api/**").hasRole("ADMIN")
						.requestMatchers("/", "/page/**", "/search", "/dashboard").hasRole("ADMIN")
						.requestMatchers("/showNewEmployeeForm", "/saveEmployee", "/showFormForUpdate/**", "/deleteEmployee/**").hasRole("ADMIN")
						.requestMatchers("/employees/me").hasAnyRole("ADMIN", "EMPLOYEE")
						.anyRequest().authenticated())
				.formLogin(form -> form
						.loginPage("/login")
						.successHandler(new RoleBasedAuthenticationSuccessHandler())
						.permitAll())
				.logout(logout -> logout
						.logoutSuccessUrl("/login?logout")
						.logoutUrl("/logout")
						.permitAll())
				.httpBasic(Customizer.withDefaults());

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(List.of("http://localhost:5173"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}

