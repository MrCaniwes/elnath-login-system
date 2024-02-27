// @ts-check

const { readdirSync } = require("fs");
const { token } = require("./src/config");
const { commands } = require("./src/components/files");
const { client } = require("./src/components/client");
const { EmbedBuilder, PermissionsBitField, AuditLogEvent, userMention } = require("discord.js");

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'host',
  user     : 'username',
  password : 'password',
  database : 'dbname'
});
 


process.on("unhandledRejection", console.error).on("uncaughtException", console.error);


readdirSync("./src/commands").forEach(async (file) => {
  const command = require(`./src/commands/${file}`);
  commands.push(command);
  console.log(`[KOMUT]` + ` ${file} komut yüklendi.`)
})

readdirSync("./src/events").forEach(async (file) => {
  const event = require(`./src/events/${file}`);
  const runner = (...args) => event.execute(...args);

  if (event.once) {
    client.once(event.name, runner);
  } else {
    client.on(event.name, runner);
  }
   console.log(`[EVENT]` + ` ${file} event yüklendi.`)
})

connection.connect(console.log("[DB] Connection Has Succesfull"));

client.on('interactionCreate', async interaction => {
	if (!interaction.isModalSubmit()) return;

  if(interaction.customId==="kayıtform"){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Get the data entered by the user
    const username = interaction.fields.getTextInputValue('username');
    const password = interaction.fields.getTextInputValue('password');
    const email = interaction.fields.getTextInputValue('email');
    const securitycode = interaction.fields.getTextInputValue('securitycode');
    const dcid = interaction.user.id;
  
    if(!emailRegex.test(email)){
      const embed = new EmbedBuilder()
      .setTitle("> Hata!")
      .setDescription("> <:close:1197232368403095634> **Lütfen geçerli bir email adresi girin!**")
      .setColor("#FF0000");
      await interaction.reply({ embeds: [embed] });
    }

    const checkSql = 'SELECT * FROM loginsystem WHERE securitycode = ? OR dcid = ? ';
    const checkValues = [securitycode,dcid];


    connection.query(checkSql, checkValues, (checkErr, checkResult) => {
      if (checkErr) {
        console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
        return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
      }
  
      if (checkResult.length > 0) {
        const embed = new EmbedBuilder()
          .setTitle("> Hata!")
          .setDescription("> <:close:1197232368403095634> **Bu kod kayıtlı veya daha önceden başka bir hesap açmışsın**")
          .setColor("#FF0000");
        return interaction.reply({ embeds: [embed] });
      }
  
      const insertSql = 'INSERT INTO loginsystem (username, password, email, securitycode, dcid) VALUES (?, ?, ?, ?, ?)';
      const insertValues = [username, password, email, securitycode, dcid];
  
      connection.query(insertSql, insertValues, async (insertErr, insertResult) => {
        if (insertErr) {
          console.error('MySQL veritabanına veri eklenirken bir hata oluştu:', insertErr);
          return interaction.reply("Kayıt işlemi sırasında bir hata oluştu.");
        }
        
        const embed = new EmbedBuilder()
          .setTitle("> Başarılı!")
          .setDescription(`
          > **Kayıt Bilgilerinizi DM üzerinden ilettim.**
          > <:done:1197232371515273246> \`Başarıyla kayıt tamamlandı, şimdi arayüzden sisteme girebilirsin!\`
          `)
          .setColor("#5865F2");
        interaction.reply({ embeds: [embed] });

        const user = interaction.user;
    try {
      const embed = new EmbedBuilder()
      .setTitle("> Hesap bilgileriniz")
      .setDescription(`
          > **Kullanıcı Adı :** \`${username}\`
          > **Şifre :** \`${password}\`
          > **Email :** \`${email}\`
          > **Güvenlik Kodu :** \`${securitycode}\`
          `)
      .setColor("#5865F2")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 1024 }));
       await user.send({embeds:[embed]})
    } catch (err) {
      interaction.reply("Hesap bilgileri gönderilirken bir hata oluştu:" + err);
    }
      });
    });
  }

  if(interaction.customId==="sifre-degistir"){

    const newpassword = interaction.fields.getTextInputValue('newpassword');
    const securitycode = interaction.fields.getTextInputValue('securitycode');
    const dcid = interaction.user.id;


    const checkSql = 'SELECT * FROM loginsystem WHERE securitycode = ? AND dcid = ? ';
    const checkValues = [securitycode,dcid];

    connection.query(checkSql, checkValues, (checkErr, checkResult) => {
      if (checkErr) {
        console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
        return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
      }
  
      if (checkResult.length < 1) {
        const embed = new EmbedBuilder()
          .setTitle("> Hata!")
          .setDescription("> <:close:1197232368403095634> **Bu kod kayıtlı değil veya bir hesap açmamışsın**")
          .setColor("#FF0000");
        return interaction.reply({ embeds: [embed] });
      }


      const checkdata = 'SELECT * FROM loginsystem WHERE password = ? AND dcid = ?';
      const checkValues2 = [newpassword,dcid]

      connection.query(checkdata,checkValues2,(checkErr,checkResult) => {
        if (checkErr) {
          console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
          return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
        }

        if(checkResult.length === newpassword){
          const embed = new EmbedBuilder()
          .setTitle("> Hata!")
          .setDescription("> <:close:1197232368403095634> **Eski şifren ile yeni şifren aynı olamaz!**")
          .setColor("#FF0000");
        return interaction.reply({ embeds: [embed] });
        }

        const updateSql = 'UPDATE loginsystem SET password = ? WHERE dcid = ? ';
        const checkValues = [newpassword,dcid]

        connection.query(updateSql,checkValues, (checkErr,checkResult) =>{
          if (checkErr) {
            console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
            return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
          }

          const embed = new EmbedBuilder()
          .setTitle("> Başarılı!")
          .setDescription("> <:done:1197232371515273246> **Şifren başarıyla değiştirildi!**")
          .setColor("#5865F2");
        return interaction.reply({ embeds: [embed] });
        })
      })


    });

  }

  if(interaction.customId==="kullanıcıadı-degistir"){

    const newusername = interaction.fields.getTextInputValue('newusername');
    const securitycode = interaction.fields.getTextInputValue('securitycode');
    const dcid = interaction.user.id;


    const checkSql = 'SELECT * FROM loginsystem WHERE securitycode = ? AND dcid = ? ';
    const checkValues = [securitycode,dcid];

    connection.query(checkSql, checkValues, (checkErr, checkResult) => {
      if (checkErr) {
        console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
        return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
      }
  
      if (checkResult.length < 1) {
        const embed = new EmbedBuilder()
          .setTitle("> Hata!")
          .setDescription("> <:close:1197232368403095634> **Bu kod kayıtlı değil veya bir hesap açmamışsın**")
          .setColor("#FF0000");
        return interaction.reply({ embeds: [embed] });
      }


      const checkdata = 'SELECT * FROM loginsystem WHERE username = ? AND dcid = ?';
      const checkValues2 = [newusername,dcid]

      connection.query(checkdata,checkValues2,(checkErr,checkResult) => {
        if (checkErr) {
          console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
          return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
        }

        if(checkResult.length === newusername){
          const embed = new EmbedBuilder()
          .setTitle("> Hata!")
          .setDescription("> <:close:1197232368403095634> **Eski kullanıcı adın ile yeni kullanıcı adın aynı olamaz!**")
          .setColor("#FF0000");
        return interaction.reply({ embeds: [embed] });
        }

        const updateSql = 'UPDATE loginsystem SET username = ? WHERE dcid = ? ';
        const checkValues = [newusername,dcid]

        connection.query(updateSql,checkValues, (checkErr,checkResult) =>{
          if (checkErr) {
            console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
            return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
          }

          const embed = new EmbedBuilder()
          .setTitle("> Başarılı!")
          .setDescription("> <:done:1197232371515273246> **Kullanıcı adın başarıyla değiştirildi!**")
          .setColor("#5865F2");
        return interaction.reply({ embeds: [embed] });
        })
      })
    })
  }


  if(interaction.customId==="hesapsil"){
    const securitycode = interaction.fields.getTextInputValue('securitycode');
    const dcid = interaction.user.id;


    const checkSql = 'SELECT * FROM loginsystem WHERE securitycode = ? AND dcid = ? ';
    const checkValues = [securitycode,dcid];

    connection.query(checkSql, checkValues, (checkErr, checkResult) => {
      if (checkErr) {
        console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
        return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
      }
  
      if (checkResult.length < 1) {
        const embed = new EmbedBuilder()
          .setTitle("> Hata!")
          .setDescription("> <:close:1197232368403095634> **Bu kod kayıtlı değil veya bir hesap açmamışsın**")
          .setColor("#FF0000");
        return interaction.reply({ embeds: [embed] });
      }


      const checkdata = 'DELETE FROM loginsystem WHERE securitycode = ? AND dcid = ?';
      const checkValues2 = [securitycode,dcid]

      connection.query(checkdata,checkValues2,(checkErr,checkResult) => {
        if (checkErr) {
          console.error('MySQL veritabanında sorgulama yapılırken bir hata oluştu:', checkErr);
          return interaction.reply("Sorgu işlemi sırasında bir hata oluştu.");
        }

        const embed = new EmbedBuilder()
          .setTitle("> Başarılı!")
          .setDescription("> <:done:1197232371515273246> **Başarıyla hesabın silindi!**")
          .setColor("#5865F2");
        return interaction.reply({ embeds: [embed] });
       
        })
      })

  }
});

client.login(token);

