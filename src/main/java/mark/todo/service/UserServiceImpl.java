package mark.todo.service;


import lombok.AllArgsConstructor;
import mark.todo.entity.Role;
import mark.todo.entity.User;
import mark.todo.pojo.Task;
import mark.todo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return unwrapUser(user,id);
    }

    @Override
    public User getUser(String nameOrEmail, String option) {
        Optional<User> user;
        if(option.equals("username")) {
            user = userRepository.findByUsername(nameOrEmail);
        } else {
            user = userRepository.findByEmail(nameOrEmail);
        }
        return unwrapUser(user, 404L);
    }

    //saves user when register
    @Override
    public User saveUser(User user) {
        //encode user password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        //set user role
        user.addRole(new Role(2L));
        return userRepository.save(user);
    }

    //only used for testing in early stages
    @Override
    public User loginUser(User user) {
        return getUser(user.getUsername(), "username");
    }

    /*
    Task functions
     */
    @Override
    public void createTask(Long id, Task task) {
        User user = getUser(id);
        user.getTasks().add(task);
        userRepository.save(user);
    }

    @Override
    public void finishTask(Long id, Task finishedTask, Boolean complete) {
        User user = getUser(id);
        getTask(user,finishedTask).setComplete(true);
        userRepository.save(user);
    }

    @Override
    public void changeDate(Long id, Task changeTask, Date date) {
        User user = getUser(id);
        getTask(user, changeTask).setDate(date);
        userRepository.save(user);
    }

    @Override
    public void changeDescription(Long id, Task changeTask, String desc) {
        User user = getUser(id);
        getTask(user, changeTask).setTaskDesc(desc);
        userRepository.save(user);
    }

    //display tasks
    @Override
    public Set<Task> allTasks(Long id) {
        User user = getUser(id);
        return user.getTasks();
    }

    //return specific task from set
    private Task getTask(User user, Task fetchTask) {
        for (Task task : user.getTasks()) {
            if (task == fetchTask) {
                return task;
            }
        }
        return null;
    }

    static User unwrapUser(Optional<User> entity, Long id) {
        if (entity.isPresent()) {
            return entity.get();
        }
        else {
            throw new EntityNotFoundException("User not found");
        }
    }
}
