package mark.todo.service;

import lombok.AllArgsConstructor;
import mark.todo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
}
