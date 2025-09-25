using Microsoft.EntityFrameworkCore;
using Login_Authentication.Models;

namespace Login_Authentication.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.EmailConfirmed).HasDefaultValue(false);
                entity.Property(e => e.Role).HasConversion<int>();
            });
        }
    }
}