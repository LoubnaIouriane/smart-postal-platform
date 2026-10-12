package ma.barid.backend.ai;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {
    private final AiAgentService service;

    public record ChatRequest(@NotBlank @Size(max = 1000) String message, List<Turn> history) {
        public record Turn(String role, String content) {}
    }
    public record ChatResponse(String reply) {}

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest req, Authentication auth) {
        return ResponseEntity.ok(new ChatResponse(service.chat(req, auth)));
    }
}