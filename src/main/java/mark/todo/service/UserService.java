package mark.todo.service;

import mark.todo.entity.User;
import mark.todo.pojo.Task;

import java.util.Date;
import java.util.Set;

public interface UserService {
    //accessing user
    User getUser(Long id);
    User getUser(String nameOrEmail, String option);
    User saveUser(User user);
    User loginUser(User user);

    //user functions
    void createTask(Long id, Task task);
    void finishTask(Long id, Task finishedTask, Boolean complete);
    void changeDate(Long id, Task changeTask, Date date);
    void changeDescription(Long id, Task changeTask, String desc);

    //Display tasks
    Set<Task> allTasks(Long id);
}
