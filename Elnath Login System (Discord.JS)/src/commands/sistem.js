const { Command } = require("../components/files");
const { EmbedBuilder, Colors, PermissionFlagsBits, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const mysql = require("mysql");


// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = new Command({
  data: (builder) =>
    builder
      .setName("sistem")
      .setDescription("Sistem")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("hesap-olustur")
          .setDescription("Sistem kayıt formu")         
          )
      .addSubcommand((subcommand) =>
          subcommand
            .setName("sifre-degistir")
            .setDescription("Şifre değiştirme formu")         
            )
      .addSubcommand((subcommand) =>
          subcommand
            .setName("kullanıcıadı-degistir")
            .setDescription("Kullanıcı adı değiştirme formu")         
              )
      .addSubcommand((subcommand) =>
          subcommand
            .setName("hesap-sil")
            .setDescription("Hesap silme formu")         
              ),
  async run(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if(subcommand==="hesap-olustur"){
        const modal = new ModalBuilder()
        .setCustomId('kayıtform')
        .setTitle('Kayıt Formu');

        const usernamerow = new TextInputBuilder()
			.setCustomId('username')
			.setLabel("Kullanmak istediğin kullanıcı adını yaz.")
            .setStyle(TextInputStyle.Short)

        const passwordrow = new TextInputBuilder()
			.setCustomId('password')
			.setLabel("Kullanmak istediğin şifreyi yaz.")
            .setStyle(TextInputStyle.Short)

        const emailrow = new TextInputBuilder()
			.setCustomId('email')
			.setLabel("Emailini yaz.")
            .setStyle(TextInputStyle.Short)

        const securitycode = new TextInputBuilder()
			.setCustomId('securitycode')
			.setLabel("Güvenlik kodunu belirle.")
            .setStyle(TextInputStyle.Short)

        const first = new ActionRowBuilder().addComponents(usernamerow);
        const second = new ActionRowBuilder().addComponents(passwordrow);
        const third = new ActionRowBuilder().addComponents(emailrow);
        const fourth = new ActionRowBuilder().addComponents(securitycode);

        modal.addComponents(first, second, third, fourth);

        await interaction.showModal(modal);        
    }

    if(subcommand==="sifre-degistir"){
      const modal = new ModalBuilder()
      .setCustomId('sifre-degistir')
      .setTitle('Şifre Değiştirme Formu');


      const newpasswordrow = new TextInputBuilder()
			.setCustomId('newpassword')
			.setLabel("Yeni şifreni yaz.")
            .setStyle(TextInputStyle.Short)

      const securitycode = new TextInputBuilder()
			.setCustomId('securitycode')
			.setLabel("Güvenlik kodunu yaz.")
            .setStyle(TextInputStyle.Short)

        const second = new ActionRowBuilder().addComponents(newpasswordrow);
        const third = new ActionRowBuilder().addComponents(securitycode);

        modal.addComponents( second, third);

        await interaction.showModal(modal);   
    }

    if(subcommand=="kullanıcıadı-degistir"){
      const modal = new ModalBuilder()
      .setCustomId('kullanıcıadı-degistir')
      .setTitle('Kullanıcı Adı Değiştirme Formu');

      const newpasswordrow = new TextInputBuilder()
			.setCustomId('newusername')
			.setLabel("Yeni kullanıcı adını yaz.")
            .setStyle(TextInputStyle.Short)

            const securitycode = new TextInputBuilder()
			.setCustomId('securitycode')
			.setLabel("Güvenlik kodunu yaz.")
            .setStyle(TextInputStyle.Short)

        const second = new ActionRowBuilder().addComponents(newpasswordrow);
        const third = new ActionRowBuilder().addComponents(securitycode);

        modal.addComponents( second, third);

        await interaction.showModal(modal);
    }

    if(subcommand=="hesap-sil"){
      const modal = new ModalBuilder()
      .setCustomId('hesapsil')
      .setTitle('Hesap Silme Formu');

            const securitycode = new TextInputBuilder()
			.setCustomId('securitycode')
			.setLabel("Güvenlik kodunu yaz.")
            .setStyle(TextInputStyle.Short)

        const third = new ActionRowBuilder().addComponents(securitycode);

        modal.addComponents(third);

        await interaction.showModal(modal);
    }
  }
});
