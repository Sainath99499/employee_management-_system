package com.example.ems.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.ems.model.AppUser;
import com.example.ems.repository.AppUserRepository;

@Service
public class DbUserDetailsService implements UserDetailsService {
	private final AppUserRepository appUserRepository;

	public DbUserDetailsService(AppUserRepository appUserRepository) {
		this.appUserRepository = appUserRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AppUser user = appUserRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		return new User(
				user.getUsername(),
				user.getPasswordHash(),
				Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
	}
}

