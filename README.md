# case_2_inzicht_en_vaardigheidstest

## Een parser om een switch output om te zetten naar JavaScript Object per Port.

Om deze app op je eigen machine te runnen heb je Node.js nodig: [how to install Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/)
Om de code uit te voeren moet je eerst in de correcte folder zijn. <br />
`cd chat-app` <br />
Vervolgens: <br />
`node .` <br />
Gebruikt automatisch index.js .

De code spreekt redelijk voor zich, maar ik zal hier het process ook neerzetten. <br />
Uit een switch komt de volgende ruwe data (switch-transceiver-details.txt):
```
Port :  1        

    Media Type            : SF+_SR  
    Vendor Name           : FS               
    Part Number           : SFP-10GSR-85     
    Serial Number         : G1807220408      
    Wavelength            : 850 nm

    Temp (Celsius)            :  35.00      Status               :  Normal   
          Low Warn Threshold  : -40.00      High Warn Threshold  :  85.00   
          Low Alarm Threshold : -50.00      High Alarm Threshold :  100.00  

    Voltage AUX-1/Vcc (Volts) :  3.27       Status               :  Normal   
          Low Warn Threshold  :  3.10       High Warn Threshold  :  3.50    
          Low Alarm Threshold :  3.00       High Alarm Threshold :  3.60    
 

    Tx Power (dBm)            : -2.82       Status               :  Normal   
          Low Warn Threshold  : -7.30       High Warn Threshold  :  2.00    
          Low Alarm Threshold : -9.30       High Alarm Threshold :  3.00    

    Rx Power (dBm)            : -4.47       Status               :  Normal   
          Low Warn Threshold  : -11.10      High Warn Threshold  :  2.00    
          Low Alarm Threshold : -13.10      High Alarm Threshold :  3.00    

    Tx Bias Current (mA):        5.28       Status               :  Normal   
          Low Warn Threshold  :  0.00       High Warn Threshold  :  12.00   
          Low Alarm Threshold :  0.00       High Alarm Threshold :  15.00  

...... etc .....

Port :  24
Error: Transceiver is not present on this port

Port :  25
Error: DDMI is not supported on this 1000T transceiver

..... etc ......

```
Deze text zit vol met spaties om het leesbaarder te maken voor een mens, echter ietwat onhandig voor een computer. Vandaar dat de `trim()` functie meerdere keren terug komt. Deze haalt van een bepaalde variabel alle white-spaces van de voor en achterkant.  <br />
Daarna was het stappenplan als volgt:
  * Verdeel de inhoud in groepen van "Port" tot "Port".
  * Verdeer die port-groepen in regels, want elke regel heeft de informatie voor 1 object.
    * 1 key-value pair.
    * Een verzameling key-value pairs, die in hun eigen sub-object terecht komen.
    * Negeer regels waar geen key-value pair te vinden is.
    * Negeer Threshold informatie.
  * Format de keys:
    * Verwijder alle tekens na een niet alfanumeriek karakter (en dat karakter zelf) `/[^a-zA-Z\d\s:]/`
    * Vervang spaties door underscores "_".
    * Convert naar lowercase.
  * Format de values:
    * Convert numerieke waardes naar int of float (beide een Number object).
    * Gedaan met: `return string==+string?+string:string.trim();`.

Deze parser is gemaakt om mijn inzicht en vaardigheden te tonen.
Case omschrijving :
>Uit een switch komt de volgende ruwe data (bijlage: switch-transceiver-details.txt).
>
>We willen dit converteren naar het onderstaande formaat met de volgende
>voorwaarden:
>  * Alle keys moeten naar lowercase
>  * De spaties in de keys moeten vervangen worden voor underscores
>  * Bij de keys, alle tekens na een niet alfanumeriek karakter negeren
>  * Threshold regels mag je negeren en hoeven niet terug te komen in de resultaten
>  * Cijfers converteren naar een integer of float

