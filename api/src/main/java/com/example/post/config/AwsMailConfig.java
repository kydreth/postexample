package com.example.post.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import org.springframework.cloud.aws.mail.simplemail.SimpleEmailServiceJavaMailSender;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class AwsMailConfig {

    private CustomPropertyConfig customPropertyConfig;

    public AwsMailConfig(final CustomPropertyConfig customPropertyConfig) {
        this.customPropertyConfig = customPropertyConfig;
    }
    // Verify domain, https://console.aws.amazon.com/ses/home?region=us-east-1#verified-senders-domain:
    // Update account details to exit sandbox, and enter production, https://console.aws.amazon.com/ses/home?region=us-east-1#dashboard:
    @Bean
    public AmazonSimpleEmailService amazonSimpleEmailService() {

        return AmazonSimpleEmailServiceClientBuilder.standard()
                .withCredentials( // TODO: instance-profile-credentials, https://cloud.spring.io/spring-cloud-aws/spring-cloud-aws.html
                        new AWSStaticCredentialsProvider(
                                new BasicAWSCredentials(
                                        customPropertyConfig.awsAccessKey, customPropertyConfig.awsSecretKey)))
                .withRegion(Regions.US_EAST_1) // TODO: use config
                .build();
    }

    @Bean
    public JavaMailSender javaMailSender(AmazonSimpleEmailService amazonSimpleEmailService) {
        return new SimpleEmailServiceJavaMailSender(amazonSimpleEmailService);
    }
}
