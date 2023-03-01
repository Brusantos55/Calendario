const date = new Date()
var actividad=undefined
var fecha=[]

window.onload=principal;
function principal(){
  
  document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1)
    date.setDate(document.querySelector("#today").innerHTML*1)
    consulta()
  });

  document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    date.setDate(document.querySelector("#today").innerHTML*1)
    consulta()
  });

  consulta()
}

function consulta(){
  fetch("calendar.php")
  .then(function (response){
      return response.json()
  })
  .then(function (data) {
    actividad=data;
    for(let i=0;i<actividad.length;i++){
      fecha[i]=actividad[i]['sFecha'].split("-")
    }
    renderCalendar();
  }) 
}

function renderCalendar(){
  console.log(actividad)
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
    for(let j = 0; j<actividad.length; j++){
      if(fecha[j][2]*1==i &&
        fecha[j][1]-1==date.getMonth()
        && fecha[j][0]*1==date.getFullYear()) {
        days += `<div class="selected" onclick="showInfo(${j}, ${i}, ${firstDayIndex})">${i}</div>`;
        i++
        }
      } 

      //guarda el dia seleccionado, pero en el mes actual presenta los dos y luego sigue con el menor(primer id).
      //    habria que hacer otro if y ponerle un id y estilo distinto a el dia actual que al seleccionado                        
      if (dia === i || i === new Date().getDate() && 
      date.getMonth() === new Date().getMonth() && 
      date.getFullYear() === new Date().getFullYear()) {
          days += `<div id="today" onclick="selected(${i}, ${firstDayIndex}, ${x})">${i}</div>`;
      } else {
        days += `<div onclick="selected(${i}, ${firstDayIndex}, ${x})">${i}</div>`;
      }
    
  }

  if(firstDayIndex+nextDays>7){
    for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
  } else {
    for (let j = 1; j <= nextDays+7; j++) {
      days += `<div class="next-date">${j}</div>`;
      monthDays.innerHTML = days;
    }
  }
};

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

function showInfo(indice, i, ini){
  //si #today=.info showinfo.
  let x=false
  selected(i,ini,x)
  
  if(document.querySelector("#infoD")==null){     
    document.querySelector(".info").setAttribute("id", "infoD"); 
  } else if(document.querySelector("#infoD")!=null && 
  document.querySelector(".info h2").innerHTML!=actividad[indice]['nombre']){
    document.querySelector(".info").setAttribute("id", "infoD");
  } else{
    document.querySelector("#infoD").removeAttribute("id");
  }
  
  document.querySelector(".info").innerHTML= "<div class='card'><h2>"
    +actividad[indice]['nombre']+"</h2> <p class='fechalugaractiviades'>"+actividad[indice]['sFecha']+" || "+actividad[indice]['sHora']+" || "+actividad[indice]['lugar']+"</p><img src='"+actividad[indice]['foto']+"' width='100%' /></div>";
   
}