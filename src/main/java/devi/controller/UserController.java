package devi.controller;

import devi.entity.User;
import devi.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User user) {
    User existingUser = userRepository.findById(id).orElseThrow();

    existingUser.setName(user.getName());
    existingUser.setEmail(user.getEmail());

    return userRepository.save(existingUser);
}

@DeleteMapping("/{id}")
public String deleteUser(@PathVariable Long id) {
    userRepository.deleteById(id);
    return "User deleted successfully";
}
}
