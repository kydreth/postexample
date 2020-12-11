package com.example.post.model;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(	name = "statuses",
		uniqueConstraints = {
				@UniqueConstraint(columnNames = "name")
		})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Status extends AuditModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Enumerated(EnumType.STRING)
	@Column(columnDefinition = "text")
	private EStatus name;
}
