# Magellan IS

## Purpose

The Purpose of this project is to document the design of the original Magellan ISO board which is no longer in use.

-----

## Circuit Diagram
The designs for the board are in this repository.  It consists of the main logic board, on which a Rabbitboard RCM2100 sits to control the entire system, and then it has three separate boards that it connects to using a 40 conduit bus.  Using Buffers,  it selects certain components to output onto the bus, and then records that information.  Afterwards, it moves onto the next set of components.

The circuit diagram formats are in ".json" and ".schdoc".  In ".shcdoc" is used by [Altium](), a professional development software.  The ".json" format is used by [EasyEDA](https://easyeda.com/), which is a free online platform.  To use EasyEDA, simply download the ".json" formatted files, and then select "Open EasyEDA file" from the "File" menu on EasyEDA.com.

Note: The PCB schematics for these circuit diagrams are not included.  Each ISO boardb may be slightly different than the rest because of space or design needs, and so each PCB requirements are different.

-----

## Programming

Unfortunately, the programming for the Rabbit board is not able to be extracted from the board, and there is no other way to recover the original programming.  However, the board microcontroller controlled the electronics using a bus system, and then displayed the information in gained on a web server it hosted at a static IP address.

-----

## Hardware

Chips:
The designs for the chips are not yet available.

Frame:
The designs for the frame are not yet available.

-----

## Resources

[RabbitCore RCM2100](http://ftp1.digi.com/support/documentation/0190091_k.pdf)
