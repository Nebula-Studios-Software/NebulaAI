using System.Text;
using System.Text.Json;
using NebulaAI.Models;
using NebulaAI.Services.Interfaces;

namespace NebulaAI.Services.Implementations;

public class ApiService : IApiService
{
    private readonly HttpClient _client;
    private readonly string _server;

    public ApiService(HttpClient client, IConfiguration configuration)
    {
        _client = client;
        _server = configuration["domain"];
    }

    public async Task<Answer> GetAnswerAsync(Question question)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_server}/generate");
        var json = JsonSerializer.Serialize(question);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var answerResponse = JsonSerializer.Deserialize<AnswerResponse>(jsonResponse, options);

        return answerResponse?.Results.FirstOrDefault() ?? new Answer();
    }
}
