namespace back_end.DTO
{
    public class RegisterDTO
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string RepeatPassword { get; set; }

    }
}
