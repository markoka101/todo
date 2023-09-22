package mark.todo.service;

import mark.todo.entity.User;
import mark.todo.pojo.Task;

import java.util.Date;
import java.util.Set;

public interface UserService {
    //accessing user
    User getUser(Long id);
    User getUser(String nameOrEmail, String option);
    void saveUser(User user);

    //creating task
    void createTask(Long id, Task task);

    //edit tasks
    void finishTask(Long id, int taskNumber, Boolean complete);
    void editTask(Long id, int taskNumber, Task updatedTask);
    void deleteTask(Long id, int taskNumber);

    //Display tasks
    Set<Task> allTasks(Long id);
}
