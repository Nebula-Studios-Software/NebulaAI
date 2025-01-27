using NebulaAI.Models;

namespace NebulaAI.Services.Interfaces;

public interface IApiService
{
    public Task<Answer> GetAnswerAsync(Question question);
}
