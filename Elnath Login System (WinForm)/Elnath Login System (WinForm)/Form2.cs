﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Elnath_Login_System__WinForm_
{
    public partial class Form2 : Form
    {

        bool dragging;

        Point offset;

        public Form2()
        {
            InitializeComponent();
        }

        #region mouse hareket ettirme işlemi
        private void Form2_MouseDown(object sender, MouseEventArgs e)
        {
            dragging = true;
            offset = e.Location;
        }

        private void Form2_MouseMove(object sender, MouseEventArgs e)
        {
            if (dragging)
            {
                Point currentScreenPos = PointToScreen(e.Location);
                Location = new
                Point(currentScreenPos.X - offset.X,
                currentScreenPos.Y - offset.Y);
            }
        }

        private void Form2_MouseUp(object sender, MouseEventArgs e)
        {
            dragging = false;
        }
        #endregion

        private void Form2_Load(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;

        }

        private void button1_Click(object sender, EventArgs e)
        {
            Application.Exit();

        }
    }
}
