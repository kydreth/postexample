package com.example.post.model;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(	name = "roles",
		uniqueConstraints = {
				@UniqueConstraint(columnNames = "name")
		})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Role extends AuditModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Enumerated(EnumType.STRING)
	@Column(columnDefinition = "text")
	private ERole name;

	public static ERole convertFromString(String role) {
		try {
			return ERole.valueOf(role.toUpperCase());
		} catch (IllegalArgumentException e) {
			return null;
		}
	}
}
