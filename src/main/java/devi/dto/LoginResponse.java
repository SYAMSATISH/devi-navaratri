package devi.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private String message;
    private String token;

    public LoginResponse() {
    }

    public LoginResponse(
            Long id,
            String name,
            String email,
            String message,
            String token) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }
}