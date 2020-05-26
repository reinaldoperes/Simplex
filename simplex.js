function condParada(p_matriz) {
	var i = p_matriz.length - 1;

	for (j = 1; j < p_matriz[i].length; j++) {
		if (p_matriz[i][j] > 0) {
			return true;
		}
	}
	return false;
}

function calcQuadro(p_matriz) {
	var nLinhas = p_matriz.length - 1;
	var nColunas = p_matriz[nLinhas].length - 1;
	var maior = p_matriz[nLinhas][1];
	indMaior = 1;

	for (j = 2; j <= nColunas; j++) {
		if (p_matriz[nLinhas][j] > maior) {
			maior = p_matriz[nLinhas][j];
			indMaior = j;
		}
	}

	var menor = Number.MAX_VALUE;
	var indMenor = 0;

	for (k = 1; k < nLinhas; k++) {
		var teste = p_matriz[k][nColunas] / p_matriz[k][indMaior]; 
		if (p_matriz[k][indMaior] != 0 && teste < menor && teste >= 0 ) { 
			menor = p_matriz[k][nColunas] / p_matriz[k][indMaior];
			indMenor = k;
		}
	}

	p_matriz[indMenor][0] = p_matriz[0][indMaior];
	var aux = p_matriz[indMenor][indMaior];

	if (aux != 1) {
		for (l = 1; l <= nColunas; l++) {
			p_matriz[indMenor][l] = p_matriz[indMenor][l] / aux;
		}
	}

	for (i = 1; i <= nLinhas; i++) {
		var aux = p_matriz[i][indMaior];
		if (i != indMenor && aux != 0) {
			for (j = 1; j <= nColunas; j++) {
				p_matriz[i][j] = parseFloat(p_matriz[i][j]) + parseFloat(-1 * aux * p_matriz[indMenor][j]);
			}
		}
	}
}

function criarForm( p_variaveis, p_restricoes) {	

	if (p_variaveis > 0 && p_restricoes > 0) {
		document.getElementById("form").style.display = 'block';
		document.getElementById("num").innerHTML+="<span>Z = </span>";
		document.getElementById("num").innerHTML+="<input type='number' class='inputZ  ' required autocomplete='off'  step='0.1'/>x<sub>1</sub>";

		for (var h = 2; h <= p_variaveis; h++) {
			document.getElementById("num").innerHTML+=" + <input type='number' class='inputZ  ' required autocomplete='off' step='0.1' id='y"+h+"' name='y"+h+"' />x<sub>"+h+"</sub>";
		}
	
		for (var i = 1; i <= p_restricoes; i++) {
			document.getElementById("num").innerHTML+="<p><b>Restrição "+i+"</b></p>";
			document.getElementById("num").innerHTML+="<input type='number' class='input  ' required autocomplete='off' step='0.1' id='x"+i+"1' name='x"+i+"1' />x<sub>1</sub>";
			for (var j = 2; j <= p_variaveis; j++) {
				document.getElementById("num").innerHTML+=" + <input type='number' class='input  ' required autocomplete='off' step='0.1' id='x"+i+j+"' name='x"+i+j+"' />x<sub>"+j+"</sub>";
			}
			document.getElementById("num").innerHTML+="<span> <= </span>"
			+"<input type='number' class='input  ' required size='5' id='b"+i+"' name='b"+i+"' />";
		}
		document.getElementById("botaoProx").style.display = 'none';
		document.getElementById("var").disabled = true;
		document.getElementById("rest").disabled = true;
	}
} 

function solucao() {
	var restricoes = parseInt(document.formSol.qntRest.value);
	var variaveis = parseInt(document.formSol.variaveis.value);	
	var linhas = parseInt(document.formSol.qntRest.value) + 1;
	var colunas = parseInt(document.formSol.variaveis.value) + parseInt(document.formSol.qntRest.value) + 1;
	
	document.getElementById("botaoSol").style.display = 'none';
	matriz = [[]];
	matriz[0][0] = 'VB';
	
	var indice = 1;
	for (var l = 1; l <= variaveis; l++) {
		matriz[0][indice] = "x"+indice;
		indice++;
	}

	for (var m = 1; m <= restricoes; m++) {
		matriz[0][indice] = "f"+m;
		indice++;
	}
	
	matriz[0][matriz[0].length] = 'b';

	var x = document.querySelectorAll(".input");
	indice = 0;
	var coluna = 0;

	for (var i = 1; i < linhas; i++) {
		matriz.push(['f'+i]);
		for (var j = 1; j <= variaveis; j++) {
			matriz[i][j] = parseFloat(x[indice].value.replace(",","."));
			indice++;
		}
		coluna = variaveis + 1;
		for (var k = 1; k <= restricoes; k++) {
			if(i==k) {
				matriz[i][coluna] = 1;
			} else {
				matriz[i][coluna] = 0;
			}
			coluna++;
		}
		matriz[i][coluna] = x[indice].value;
		indice++;
	}
	
	var z = document.querySelectorAll(".inputZ");
	coluna = 0;
	matriz.push(['-Z']);
	
	for (var l = 0; l < variaveis; l++) {
		matriz[linhas][l+1] = parseFloat(z[l].value.replace(",","."));
	}
	coluna = variaveis + 1;
	for (var m = 1; m <= restricoes; m++) {
		matriz[linhas][coluna] = 0;
		coluna++;
	}
	matriz[linhas][coluna] = 0;

	while ( condParada(matriz)) {		
		   calcQuadro(matriz);
	}
	
	var solucao = "Solução: ";
	
	for (var n = 1; n <= variaveis; n++) {
		var valor = 0;
		for (var o = 1; o <= restricoes; o++) {
			if (matriz[o][0] == 'x'+n) {
				valor = matriz[o][colunas];
				break;
			}
		}
		var fracao = valor;
		if (n == variaveis) {
			solucao += "x"+n+" = "+fracao;
		} else {
			solucao += "x"+n+" = "+fracao+", ";
		}
	}
	
	var fracao = (matriz[linhas][colunas])*-1;
	solucao += " e Z = "+fracao;
	document.getElementById("tab").innerHTML+="<p><b>"+solucao+"</b></p>";	
}