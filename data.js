const CATEGORIES = [
  {
    id: 'persons',
    onlyDE: false,
    words: {
      de: ['Albert Einstein','Angela Merkel','Beethoven','Mozart','Adolf Hitler','Karl Marx','Sigmund Freud','Martin Luther','Konrad Adenauer','Otto von Bismarck','Friedrich Nietzsche','Goethe','Schiller','Immanuel Kant','Max Planck','Werner Heisenberg','Marlene Dietrich','Michael Schumacher','Boris Becker','Franz Beckenbauer','Steffi Graf','Till Lindemann','Heidi Klum','Til Schweiger','Thomas Müller','Robert Lewandowski','Cristiano Ronaldo','Lionel Messi','Michael Jackson','Elvis Presley','Marilyn Monroe','Napoleon','Cleopatra','Julius Caesar','Leonardo da Vinci','Michelangelo','Shakespeare','Charles Darwin','Isaac Newton','Galileo Galilei','Abraham Lincoln','Barack Obama','Donald Trump','Queen Elizabeth II','Winston Churchill','Nelson Mandela','Mahatma Gandhi','Dalai Lama','Elon Musk','Bill Gates','Steve Jobs','Mark Zuckerberg','Oprah Winfrey','Taylor Swift','Beyoncé','Adele','Ed Sheeran','Justin Bieber','Lady Gaga','Madonna','David Beckham','LeBron James','Muhammad Ali','Serena Williams','Roger Federer','Novak Djokovic'],
      en: ['Albert Einstein','Angela Merkel','Beethoven','Mozart','Karl Marx','Sigmund Freud','Martin Luther','Goethe','Michael Schumacher','Boris Becker','Heidi Klum','Thomas Müller','Robert Lewandowski','Cristiano Ronaldo','Lionel Messi','Michael Jackson','Elvis Presley','Marilyn Monroe','Napoleon','Cleopatra','Julius Caesar','Leonardo da Vinci','Michelangelo','Shakespeare','Charles Darwin','Isaac Newton','Galileo Galilei','Abraham Lincoln','Barack Obama','Donald Trump','Queen Elizabeth II','Winston Churchill','Nelson Mandela','Mahatma Gandhi','Dalai Lama','Elon Musk','Bill Gates','Steve Jobs','Mark Zuckerberg','Oprah Winfrey','Taylor Swift','Beyoncé','Adele','Ed Sheeran','Justin Bieber','Lady Gaga','Madonna','David Beckham','LeBron James','Muhammad Ali','Serena Williams','Roger Federer','Novak Djokovic']
    }
  },
  {
    id: 'jobs',
    onlyDE: false,
    words: {
      de: ['Arzt','Lehrer','Polizist','Feuerwehrmann','Koch','Bäcker','Ingenieur','Architekt','Anwalt','Richter','Pilot','Astronaut','Krankenschwester','Zahnarzt','Tierarzt','Apotheker','Buchhalter','Manager','Programmierer','Designer','Journalist','Fotograf','Schauspieler','Musiker','Maler','Bildhauer','Schriftsteller','Bibliothekar','Bibliothekar','Elektriker','Klempner','Schreiner','Maurer','Gärtner','Bauer','Fischer','Jäger','Soldat','Kellner','Busfahrer','Taxifahrer','LKW-Fahrer','Postbote','Müllmann','Friseur','Kosmetikerin','Masseur','Physiotherapeut','Psychologe','Sozialpädag'],
      en: ['Doctor','Teacher','Police Officer','Firefighter','Cook','Baker','Engineer','Architect','Lawyer','Judge','Pilot','Astronaut','Nurse','Dentist','Vet','Pharmacist','Accountant','Manager','Programmer','Designer','Journalist','Photographer','Actor','Musician','Painter','Sculptor','Writer','Librarian','Electrician','Plumber','Carpenter','Bricklayer','Gardener','Farmer','Fisherman','Hunter','Soldier','Waiter','Bus Driver','Taxi Driver','Truck Driver','Postman','Garbage Collector','Hairdresser','Beautician','Masseur','Physiotherapist','Psychologist','Social Worker','Scientist']
    }
  },
  {
    id: 'verbs',
    onlyDE: false,
    words: {
      de: ['laufen','springen','schwimmen','fliegen','singen','tanzen','schlafen','essen','trinken','lesen','schreiben','malen','bauen','kochen','waschen','putzen','fahren','reiten','klettern','tauchen','schießen','werfen','fangen','schlagen','heben','tragen','ziehen','drücken','öffnen','schließen','reparieren','graben','pflanzen','ernten','backen','braten','schneiden','nähen','stricken','hämmern','sägen','bohren','messen','wiegen','fotografieren','filmen','singen','spielen','tanzen','winken'],
      en: ['run','jump','swim','fly','sing','dance','sleep','eat','drink','read','write','paint','build','cook','wash','clean','drive','ride','climb','dive','shoot','throw','catch','hit','lift','carry','pull','push','open','close','repair','dig','plant','harvest','bake','fry','cut','sew','knit','hammer','saw','drill','measure','weigh','photograph','film','play','wave','whisper','shout']
    }
  },
  {
    id: 'fruits',
    onlyDE: false,
    words: {
      de: ['Apfel','Birne','Banane','Orange','Zitrone','Limette','Grapefruit','Erdbeere','Himbeere','Blaubeere','Brombeere','Kirsche','Pflaume','Pfirsich','Aprikose','Mango','Papaya','Ananas','Kiwi','Wassermelone','Honigmelone','Weintraube','Feige','Dattel','Kokosnuss','Avocado','Granatapfel','Lychee','Passionsfrucht','Drachenfrucht','Guave','Jackfrucht','Durian','Sternfrucht','Kumquat','Clementine','Mandarine','Nektarine','Marille','Zwetschge','Johannisbeere','Stachelbeere','Holunderbeere','Sanddorn','Maulbeere','Quitte','Mirabelle','Reneklode'],
      en: ['Apple','Pear','Banana','Orange','Lemon','Lime','Grapefruit','Strawberry','Raspberry','Blueberry','Blackberry','Cherry','Plum','Peach','Apricot','Mango','Papaya','Pineapple','Kiwi','Watermelon','Honeydew','Grape','Fig','Date','Coconut','Avocado','Pomegranate','Lychee','Passion Fruit','Dragon Fruit','Guava','Jackfruit','Durian','Starfruit','Kumquat','Clementine','Mandarin','Nectarine','Gooseberry','Elderberry','Sea Buckthorn','Mulberry','Quince']
    }
  },
  {
    id: 'vegetables',
    onlyDE: false,
    words: {
      de: ['Karotte','Kartoffel','Tomate','Gurke','Paprika','Zucchini','Aubergine','Brokkoli','Blumenkohl','Rotkohl','Weißkohl','Wirsing','Spinat','Salat','Rucola','Sellerie','Lauch','Zwiebel','Knoblauch','Ingwer','Rote Bete','Radieschen','Rettich','Kürbis','Mais','Erbsen','Bohnen','Linsen','Kichererbsen','Champignon','Pfifferlinge','Steinpilz','Artischocke','Spargel','Fenchel','Kohlrabi','Mangold','Pak Choi','Süßkartoffel','Topinambur','Pastinake','Schwarzwurzel','Chicorée','Endivie','Portulak'],
      en: ['Carrot','Potato','Tomato','Cucumber','Bell Pepper','Zucchini','Eggplant','Broccoli','Cauliflower','Red Cabbage','White Cabbage','Savoy Cabbage','Spinach','Lettuce','Rocket','Celery','Leek','Onion','Garlic','Ginger','Beetroot','Radish','Pumpkin','Corn','Peas','Beans','Lentils','Chickpeas','Mushroom','Chanterelle','Porcini','Artichoke','Asparagus','Fennel','Kohlrabi','Swiss Chard','Bok Choy','Sweet Potato','Jerusalem Artichoke','Parsnip','Chicory','Endive']
    }
  },
  {
    id: 'food',
    onlyDE: false,
    words: {
      de: ['Pizza','Pasta','Sushi','Burger','Döner','Schnitzel','Bratwurst','Currywurst','Brezel','Croissant','Baguette','Bagel','Hot Dog','Tacos','Burrito','Enchilada','Paella','Risotto','Lasagne','Ramen','Pad Thai','Pho','Dumplings','Spring Rolls','Falafel','Hummus','Kebab','Gyros','Moussaka','Shakshuka','Gulasch','Eintopf','Sauerbraten','Kassler','Leberkäse','Weißwurst','Blutwurst','Sülze','Rollmops','Matjes','Lachs','Forelle','Thunfisch-Sandwich','Caprese','Caesar Salad','Waldorf Salad','Fondue','Raclette','Tartiflette'],
      en: ['Pizza','Pasta','Sushi','Burger','Kebab','Schnitzel','Bratwurst','Pretzel','Croissant','Baguette','Bagel','Hot Dog','Tacos','Burrito','Enchilada','Paella','Risotto','Lasagna','Ramen','Pad Thai','Pho','Dumplings','Spring Rolls','Falafel','Hummus','Gyros','Moussaka','Shakshuka','Goulash','Stew','Salmon','Tuna Sandwich','Caprese','Caesar Salad','Waldorf Salad','Fondue','Raclette','Fish and Chips','Sheperd\'s Pie','Beef Wellington','Coq au Vin','Bouillabaisse','Crêpe','Waffle','Pancake','French Toast']
    }
  },
  {
    id: 'drinks',
    onlyDE: false,
    words: {
      de: ['Wasser','Saft','Cola','Fanta','Sprite','Limonade','Eistee','Kaffee','Espresso','Cappuccino','Latte Macchiato','Tee','Kakao','Milch','Bier','Weißbier','Radler','Sekt','Champagner','Prosecco','Rotwein','Weißwein','Rosé','Whisky','Vodka','Rum','Gin','Tequila','Martini','Mojito','Margarita','Pina Colada','Caipirinha','Sangria','Glühwein','Eierlikör','Aperol Spritz','Hugo','Kir Royal','Long Island Ice Tea','Red Bull','Monster','Gatorade','Smoothie','Shake','Buttermilch'],
      en: ['Water','Juice','Cola','Fanta','Sprite','Lemonade','Iced Tea','Coffee','Espresso','Cappuccino','Latte','Tea','Cocoa','Milk','Beer','Wheat Beer','Shandy','Sparkling Wine','Champagne','Prosecco','Red Wine','White Wine','Rosé','Whisky','Vodka','Rum','Gin','Tequila','Martini','Mojito','Margarita','Pina Colada','Caipirinha','Sangria','Mulled Wine','Eggnog','Aperol Spritz','Smoothie','Milkshake','Buttermilk','Red Bull','Energy Drink','Kombucha','Kefir']
    }
  },
  {
    id: 'brands',
    onlyDE: false,
    words: {
      de: ['Apple','Nike','Adidas','Mercedes','BMW','Volkswagen','Audi','Porsche','Ferrari','Lamborghini','Tesla','Samsung','Google','Microsoft','Amazon','Facebook','Instagram','YouTube','TikTok','Netflix','Spotify','Lego','Ikea','H&M','Zara','Louis Vuitton','Gucci','Prada','Chanel','Rolex','Coca-Cola','Pepsi','McDonald\'s','Burger King','Subway','KFC','Starbucks','Red Bull','Nutella','Milka','Haribo','Nivea','Schwarzkopf','Siemens','Bosch','Miele','Dyson','Philips','Sony','Nintendo','Playstation'],
      en: ['Apple','Nike','Adidas','Mercedes','BMW','Volkswagen','Audi','Porsche','Ferrari','Lamborghini','Tesla','Samsung','Google','Microsoft','Amazon','Facebook','Instagram','YouTube','TikTok','Netflix','Spotify','Lego','Ikea','H&M','Zara','Louis Vuitton','Gucci','Prada','Chanel','Rolex','Coca-Cola','Pepsi','McDonald\'s','Burger King','Subway','KFC','Starbucks','Red Bull','Nutella','Milka','Haribo','Nivea','Siemens','Bosch','Dyson','Philips','Sony','Nintendo','Playstation','Lamborghini']
    }
  },
  {
    id: 'places',
    onlyDE: false,
    words: {
      de: ['Eiffelturm','Big Ben','Kolosseum','Akropolis','Sagrada Família','Taj Mahal','Chinesische Mauer','Machu Picchu','Chichén Itzá','Angkor Wat','Pyramiden von Gizeh','Stonehenge','Parthenon','Pantheon','Vatikan','Brandenburger Tor','Neuschwanstein','Kölner Dom','Freiheitsstatue','Golden Gate Bridge','Niagara-Fälle','Grand Canyon','Times Square','Hollywood','Las Vegas','Sydney Opera','Uluru','Petra','Alhambra','Burj Khalifa','Burj Al Arab','Hagia Sophia','Blaue Moschee','Kremlin','Roter Platz','Louvre','Trevi-Brunnen','Piazza San Marco','Leaning Tower of Pisa','Rijksmuseum','Anne-Frank-Haus','Atomium','Manneken Pis','Mont Saint-Michel','Schloss Versailles','Barcelona','Santorini'],
      en: ['Eiffel Tower','Big Ben','Colosseum','Acropolis','Sagrada Família','Taj Mahal','Great Wall of China','Machu Picchu','Chichén Itzá','Angkor Wat','Pyramids of Giza','Stonehenge','Parthenon','Pantheon','Vatican','Brandenburg Gate','Neuschwanstein','Cologne Cathedral','Statue of Liberty','Golden Gate Bridge','Niagara Falls','Grand Canyon','Times Square','Hollywood','Las Vegas','Sydney Opera House','Uluru','Petra','Alhambra','Burj Khalifa','Burj Al Arab','Hagia Sophia','Blue Mosque','Kremlin','Red Square','Louvre','Trevi Fountain','Piazza San Marco','Leaning Tower of Pisa','Rijksmuseum','Anne Frank House','Atomium','Mont Saint-Michel','Palace of Versailles']
    }
  },
  {
    id: 'countries',
    onlyDE: false,
    words: {
      de: ['Deutschland','Frankreich','Spanien','Italien','Portugal','Griechenland','Türkei','Russland','Ukraine','Polen','Tschechien','Österreich','Schweiz','Niederlande','Belgien','Schweden','Norwegen','Dänemark','Finnland','Island','Irland','Großbritannien','USA','Kanada','Mexiko','Brasilien','Argentinien','Chile','Peru','Kolumbien','Kuba','Japan','China','Indien','Australien','Neuseeland','Südafrika','Ägypten','Marokko','Nigeria','Kenia','Saudi-Arabien','Iran','Irak','Israel','Thailand','Vietnam','Indonesien','Malaysia','Singapur'],
      en: ['Germany','France','Spain','Italy','Portugal','Greece','Turkey','Russia','Ukraine','Poland','Czech Republic','Austria','Switzerland','Netherlands','Belgium','Sweden','Norway','Denmark','Finland','Iceland','Ireland','United Kingdom','USA','Canada','Mexico','Brazil','Argentina','Chile','Peru','Colombia','Cuba','Japan','China','India','Australia','New Zealand','South Africa','Egypt','Morocco','Nigeria','Kenya','Saudi Arabia','Iran','Iraq','Israel','Thailand','Vietnam','Indonesia','Malaysia','Singapore']
    }
  },
  {
    id: 'cities_de',
    onlyDE: true,
    words: {
      de: ['Berlin','Hamburg','München','Köln','Frankfurt','Stuttgart','Düsseldorf','Leipzig','Dortmund','Essen','Bremen','Dresden','Hannover','Nürnberg','Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster','Karlsruhe','Mannheim','Augsburg','Wiesbaden','Gelsenkirchen','Mönchengladbach','Braunschweig','Kiel','Chemnitz','Aachen','Halle','Magdeburg','Freiburg','Krefeld','Lübeck','Oberhausen','Erfurt','Mainz','Rostock','Kassel','Hagen','Hamm','Saarbrücken','Mülheim','Potsdam','Ludwigshafen','Oldenburg','Leverkusen','Osnabrück','Solingen'],
      en: []
    }
  }
];

function getWords(categoryId, lang) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];
  return cat.words[lang] || cat.words.de;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
