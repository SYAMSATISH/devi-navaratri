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
                .filter(u -> "MEMBER".equals(u.getRole()))
                .count();

        if (memberCount >= 10) {
            throw new RuntimeException(
                    "Maximum 10 members are allowed"
            );
        }

        user.setRole("MEMBER");

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        ));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
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
                                "User not found"
                        ));

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
                                "User not found"
                        ));

        userRepository.delete(user);
    }

    // RESET PASSWORD
    public void resetPassword(
            Long id,
            String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );

        userRepository.save(user);
    }

    // GET ALL MEMBERS
    public List<User> getMembers() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        "MEMBER".equals(user.getRole()))
                .toList();
    }

    // GET ALL ADMINS
    public List<User> getAdmins() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        "ADMIN".equals(user.getRole()))
                .toList();
    }

    // CREATE ADMIN
    public User createAdmin(User user) {

        user.setRole("ADMIN");

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // CHANGE USER ROLE
    public User changeRole(
            Long id,
            String role) {

        if (!role.equals("ADMIN")
                && !role.equals("MEMBER")) {

            throw new RuntimeException(
                    "Role must be ADMIN or MEMBER"
            );
        }

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        // If changing to MEMBER,
        // check maximum 10 members
        if ("MEMBER".equals(role)
                && !"MEMBER".equals(user.getRole())) {

            long memberCount = userRepository.findAll()
                    .stream()
                    .filter(u ->
                            "MEMBER".equals(u.getRole()))
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
}