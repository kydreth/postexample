package com.example.post.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Post extends AuditModel {
    @Id
    @GeneratedValue(generator = "post_generator")
    @SequenceGenerator(
            name = "post_generator",
            sequenceName = "post_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotBlank
    @Column(columnDefinition = "text")
    private String title;

    @NotBlank
    @Column(columnDefinition = "text")
    private String description;

    @NotBlank
    @Column(columnDefinition = "boolean")
    private Boolean active;

    @Column(columnDefinition = "text")
    private String businessCase;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

//    // TODO: list
//    @Column(columnDefinition = "text")
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    private String comments;
}
