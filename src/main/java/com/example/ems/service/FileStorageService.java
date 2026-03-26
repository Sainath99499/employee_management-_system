package com.example.ems.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

	private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
			"image/png",
			"image/jpeg",
			"image/webp",
			"image/gif");

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	public String storeProfileImage(MultipartFile file) throws IOException {
		if (file == null || file.isEmpty()) {
			return null;
		}
		String contentType = file.getContentType();
		if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
			throw new IllegalArgumentException("Only image files are allowed (png, jpg, webp, gif).");
		}

		Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
		Files.createDirectories(uploadPath);

		String original = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
		String ext = "";
		int dot = original.lastIndexOf('.');
		if (dot >= 0 && dot < original.length() - 1) {
			ext = original.substring(dot).toLowerCase();
		}
		String filename = "emp-" + UUID.randomUUID() + ext;
		Path target = uploadPath.resolve(filename).normalize();

		try (InputStream in = file.getInputStream()) {
			Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
		}

		return "/uploads/" + filename;
	}
}

