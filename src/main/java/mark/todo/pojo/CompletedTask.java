package mark.todo.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.util.Date;

@Embeddable
@NoArgsConstructor
@Getter
@Setter
public class CompletedTask {

    @NonNull
    private String taskDesc;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    @NonNull
    private Date dateCompleted;

    public CompletedTask(String taskDesc, Date date) {
        this.taskDesc = taskDesc;
        this.dateCompleted = date;
    }
}
