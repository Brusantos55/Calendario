const date = new Date()
var reservas=undefined
var fecha2=[]
var next=false

window.onload=principal;
function principal(){
  
  document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1)
    date.setDate(document.querySelector("#today").innerHTML*1)
    //ToDo consulta() hacer que se puedan tener reservas que empiezan en un mes y terminan en el siguiente
    renderCalendar();
  });

  document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    date.setDate(document.querySelector("#today").innerHTML*1)
    renderCalendar();
  });

    renderCalendar();
}

function renderCalendar(){
  reservas = {'0':{'id':'example','ini':'07/01/2024','end':'10/01/2024'},
              '1':{'id':'dos','ini':'24/01/2024','end':'27/01/2024'},
              '2':{'id':'tres','ini':'04/02/2024','end':'06/02/2024'}}
  fechas=getReservas(reservas)
  let dia=date.getDate()
  date.setDate(1)

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  var firstDayIndex=0;
  if(date.getDay()==0){
    firstDayIndex = date.getDay() + 6;
  } else { firstDayIndex = date.getDay() - 1; }

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay() - 1;

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  document.querySelector(".date p").innerHTML = new Date().toLocaleDateString("es-ES", options);

  let days = ""; let x=true;

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    for(let j = 0; j<fechas.length; j++){
      if(fechas[j][2]==i &&
        fechas[j][1]==date.getMonth()+1
        && fechas[j][0]==date.getFullYear()) {
        days += `<div reserved class="reserved ${fechas[j][3]}">${i}</div>`;
        i++
      }
    } 
    if (i === new Date().getDate() ) {
        days += `<div id="today" onclick="setFecha(${i}, ${firstDayIndex})">${i}</div>`;
    } else {
      days += `<div onclick="setFecha(${i}, ${firstDayIndex})">${i}</div>`;
    }
  }

  if(firstDayIndex+nextDays>7){
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="next-date" onclick="setFecha(${j}, ${firstDayIndex}, ${lastDay})">${j}</div>`;
      monthDays.innerHTML = days;
    }
  } else {
    for (let j = 1; j <= nextDays+7; j++) {
      days += `<div class="next-date" onclick="setFecha(${j}, ${firstDayIndex}, ${lastDay})">${j}</div>`;
      monthDays.innerHTML = days;
    }
  }
};

function getReservas(act){
  let fechas=[]
  
  for(let j = 0; j<3; j++){
    ini = act[j]['ini'].split('/')
    end = act[j]['end'].split('/')
    // getBtw
    for (let i = ini[0]*1; i <= end[0]; i++){
      let fecha = [ini[2]*1,ini[1]*1,i,'btw']
      if(fecha[2]==ini[0])fecha[3]='ini'
      if(fecha[2]==end[0])fecha[3]='end'
      fechas.push(fecha)
    }
  };
  return fechas
}

function selected(i,ini, x){
  let n=ini+i;
  if(document.querySelector("#today")!=null)
  document.querySelector("#today").removeAttribute("id");
  document.querySelector(".days div:nth-child("+n+")").setAttribute("id", "today");
  let dia=i; let mes=date.getMonth(); let anio=date.getFullYear();
  let fecha=new Date(anio,mes,dia);
  let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  document.querySelector("div.date p").innerHTML = fecha.toLocaleDateString("es-ES", options);

  if( x==true && document.querySelector("#infoD")!=null )
    document.querySelector("#infoD").removeAttribute("id");
}

function setFecha(i, ini, next){
  let f = undefined
  if(next){
    f= {'year' : date.getFullYear(),'month':date.getMonth()+2, 'day':i}
  } else {
    f= {'year' : date.getFullYear(),'month':date.getMonth()+1, 'day':i} //new Date(date.getFullYear,date.getMonth,i)
  }
  let nop=false
  fecha2.push(f)
  if (fecha2.length==2){
    if(next){
      for (let i = fecha2[0]['day']+1; i < fecha2[1]['day']+next; i++){
        if(document.querySelector(".days div:nth-child("+(ini+i)+")").hasAttribute('reserved')){
          nop=true; break}
        document.querySelector(".days div:nth-child("+(ini+i)+")").setAttribute("class", "btw selected");
      }
      document.querySelector(".days div:nth-child("+(ini+i+next)+")").setAttribute("class", "end selected");
    } else {
      for (let i = fecha2[0]['day']+1; i < fecha2[1]['day']; i++){
        if(document.querySelector(".days div:nth-child("+(ini+i)+")").hasAttribute('reserved')){
          nop=true; break}
        document.querySelector(".days div:nth-child("+(ini+i)+")").setAttribute("class", "btw selected");
      }
      document.querySelector(".days div:nth-child("+(ini+i)+")").setAttribute("class", "end selected");
    }
    
    if(nop){
      selc = document.querySelectorAll('.selected')
      selc.forEach(element => {element.removeAttribute('class')});
      alert('u can`t reserve days already reserved')
    }
  } else {
    if(fecha2.length>2)fecha2=[]
    selc = document.querySelectorAll('.selected')
    selc.forEach(element => {element.removeAttribute('class')});
    document.querySelector(".days div:nth-child("+(ini+i)+")").setAttribute("class", "ini selected");
  }
}