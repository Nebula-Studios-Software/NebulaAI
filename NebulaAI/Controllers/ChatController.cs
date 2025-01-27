using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using NebulaAI.Models;
using NebulaAI.Services.Interfaces;

public class ChatController : Controller
{
    private readonly IApiService _api;
    private readonly string _dataPath = "wwwroot/data";
    private readonly ILogger<ChatController> _logger;

    public ChatController(IApiService api, ILogger<ChatController> logger)
    {
        _api = api;
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Send([FromForm] Dictionary<string, string> parameters)
    {
        var question = new Question
        {
            MaxContextLength = int.Parse(parameters["max_context_lenght"]),
            MaxLenght = int.Parse(parameters["max_lenght"]),
            Prompt = parameters["prompt"],
            Quiet = false
        };
        var answer = await _api.GetAnswerAsync(question);
        _logger.LogInformation("Received answer: {Answer}", answer);

        var userId = parameters["user_id"];
        SaveMessage(userId, question.Prompt, answer.Text);

        return Json(new { text = answer });
    }

    [HttpGet]
    public IActionResult LoadMessages(string userId)
    {
        var messages = LoadMessagesFromFile(userId);
        return Json(messages);
    }

    private void SaveMessage(string userId, string question, string answer)
    {
        var filePath = Path.Combine(_dataPath, $"{userId}.json");
        var messages = LoadMessagesFromFile(userId) ?? new List<Dictionary<string, string>>();

        var message = new Dictionary<string, string>
        {
            { "question", question },
            { "answer", answer },
            { "timestamp", DateTime.UtcNow.ToString("o") } // Includi il timestamp
        };

        messages.Add(message);

        var json = JsonSerializer.Serialize(messages);
        System.IO.File.WriteAllText(filePath, json);
    }

    private List<Dictionary<string, string>> LoadMessagesFromFile(string userId)
    {
        var filePath = Path.Combine(_dataPath, $"{userId}.json");
        if (System.IO.File.Exists(filePath))
        {
            var json = System.IO.File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<List<Dictionary<string, string>>>(json);
        }

        return new List<Dictionary<string, string>>();
    }

    [HttpDelete]
public IActionResult ClearMessages(string userId)
{
    var filePath = Path.Combine(_dataPath, $"{userId}.json");
    if (System.IO.File.Exists(filePath))
    {
        System.IO.File.Delete(filePath);
    }
    return Ok();
}
}
