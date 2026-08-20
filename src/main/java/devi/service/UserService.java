package devi.service;

import devi.entity.User;
import devi.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // CREATE MEMBER
    public User createUser(User user) {

        long memberCount = userRepository.findAll()
                .stream()
                .filter(existingUser ->
                        "MEMBER".equals(existingUser.getRole()))
                .count();

        if (memberCount >= 10) {
            throw new RuntimeException(
                    "Maximum 10 members are allowed"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // Normal users are always MEMBERS
        user.setRole("MEMBER");

        return userRepository.save(user);
    }

    // CREATE ADMIN
    public User createAdmin(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        user.setRole("ADMIN");

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password");
        }

        return user;
    }

    // UPDATE USER
    public User updateUser(
            Long id,
            User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        existingUser.setName(
                updatedUser.getName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }

        return userRepository.save(existingUser);
    }

    // DELETE USER
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        userRepository.delete(user);
    }

    // RESET PASSWORD
    public void resetPassword(
            Long id,
            String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);
    }

    // CHANGE ROLE
    public User changeRole(
            Long id,
            String role) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        if (!role.equals("ADMIN")
                && !role.equals("MEMBER")) {

            throw new RuntimeException(
                    "Role must be ADMIN or MEMBER");
        }

        // If changing ADMIN to MEMBER,
        // check the 10-member limit.
        if ("MEMBER".equals(role)
                && !"MEMBER".equals(user.getRole())) {

            long memberCount = userRepository.findAll()
                    .stream()
                    .filter(existingUser ->
                            "MEMBER".equals(
                                    existingUser.getRole()))
                    .count();

            if (memberCount >= 10) {
                throw new RuntimeException(
                        "Maximum 10 members are allowed"
                );
            }
        }

        user.setRole(role);

        return userRepository.save(user);
    }

    // GET ONLY MEMBERS
    public List<User> getMembers() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        "MEMBER".equals(user.getRole()))
                .toList();
    }

    // GET ONLY ADMINS
    public List<User> getAdmins() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        "ADMIN".equals(user.getRole()))
                .toList();
    }
}