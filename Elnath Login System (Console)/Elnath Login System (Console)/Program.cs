using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;


namespace Elnath_Login_System__Console_
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "";

            // Veritabanı bağlantısını oluştur
            MySqlConnection connection = new MySqlConnection(connectionString);

            try
            {
                connection.Open(); // Veritabanı bağlantısını aç

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[DB] Veritabanına başarıyla bağlanıldı!");
                Console.ForegroundColor = ConsoleColor.White;
                Thread.Sleep(3000);

                // Kullanıcı giriş bilgilerini al
                Console.WriteLine("Kullanıcı adı :");
                Console.ForegroundColor = ConsoleColor.Blue;
                string username = Console.ReadLine();

                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine("Şifre :");
                Console.ForegroundColor = ConsoleColor.Blue;
                string password = Console.ReadLine();

                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine("Email :");
                Console.ForegroundColor = ConsoleColor.Blue;
                string email = Console.ReadLine();

                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine("Güvenlik Kodu :");
                Console.ForegroundColor = ConsoleColor.Blue;
                string securitypassword = Console.ReadLine();

                // Veritabanından bilgileri al ve doğrula
                MySqlCommand cmd = new MySqlCommand("SELECT * FROM loginsystem WHERE username = @username AND password = @password AND email = @email AND securitycode = @securitycode", connection);
                cmd.Parameters.AddWithValue("@username", username);
                cmd.Parameters.AddWithValue("@password", password);
                cmd.Parameters.AddWithValue("@email", email);
                cmd.Parameters.AddWithValue("@securitycode", securitypassword);

                MySqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    Console.ForegroundColor = ConsoleColor.Green;
                    Thread.Sleep(3000);
                    Console.WriteLine("[DB] Giriş başarılı!");
                    Thread.Sleep(3000);
                    Console.WriteLine("[SİSTEM] Sisteme Hoş Geldin!");
                    Thread.Sleep(3000);
                    string dcid = reader.GetString("dcid");
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"[DB] Discord ID'niz: {dcid}");
                    Console.ReadKey();
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Thread.Sleep(3000);
                    Console.WriteLine("[DB] Sanırım.. bazı bilgilerini yanlış girdin");
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Hata: " + ex.Message);
            }
            finally
            {
                connection.Close(); // Veritabanı bağlantısını kapat
            }

            Console.ReadLine();
        }
    }
}
