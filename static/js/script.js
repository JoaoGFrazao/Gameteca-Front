
// if usado para definir mensagem de boas vindas baseado na hora do dia 
let hora = new Date().getHours()
let saudacao

if (hora < 12) {
    saudacao = "Bom Dia Sorcerer. Bem vindo a sua Gameteca"
} else if (hora < 18) {
    saudacao = "Boa Tarde Sorcerer. Bem vindo a sua Gameteca"
} else {
    saudacao = "Boa Noite Sorcerer. Bem vindo a sua Gameteca"
}
console.log("run")

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("mensagem").innerHTML = saudacao
});

// função para rolar um dado de 20 faces e mostrar uma mensagem dependendo do resultado
function rolarD20() {
    const resultado = Math.floor(Math.random() * 20) + 1;

    if (resultado > 17) {
        document.getElementById("d20-text").textContent = `Resultado: ${resultado} - A magia ancestral corre em suas veias`;
    } else if (resultado > 14) {
        document.getElementById("d20-text").textContent = `Resultado: ${resultado} - Muito bom sorcerer, você é digno`;
    } else if (resultado > 10) {
        document.getElementById("d20-text").textContent = `Resultado: ${resultado} - Sua dignidade é o suficiente para a aventura`;
    } else if (resultado > 6) {
        document.getElementById("d20-text").textContent = `Resultado: ${resultado} - A Gameteca é sua, faça como preferir`;
    } else {
        document.getElementById("d20-text").textContent = `Resultado: ${resultado} - Não liga para o dado, ele não sabe o que faz`;
    }
}

// função para adicionar novos jogos no BD chamando a rota /add_game e alertar caso constraints não sejam cumpridas
function adicionarJogo() {
    const nome = document.querySelector('input[name="nome"]').value;
    const publisher = document.querySelector('input[name="publisher"]').value;
    const playtime = document.querySelector('input[name="playtime"]').value;
    const min_players = document.querySelector('input[name="min_players"]').value;
    const max_players = document.querySelector('input[name="max_players"]').value;
    const main_mechanic = document.querySelector('input[name="main_mechanic"]').value;

    if (max_players < min_players) {
        return alert("O número máximo de jogadores não pode ser menor que o número mínimo")
    } else {
        console.log("min/max jogadores válido")
    }

    if (playtime < 0) {
        return alert("O tempo de jogo não pode ser menor que 0")
    } else {
        console.log("tempo de jogo válido")
    }


    fetch('/add_game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nome=${nome}&publisher=${publisher}&playtime=${playtime}&min_players=${min_players}&max_players=${max_players}&main_mechanic=${main_mechanic}`,
    })
    .then(response => {
        if (response.ok) {
            return alert("jogo adicionado com sucesso");
        } else {
            throw new Error('Erro ao adicionar jogo verifique as informações');
        }
    })
    .catch(error => {
        console.error(error);
    })
    .then(() => {
        window.location.reload();
    });
}

// Chama a rota /list_all para mostrar todos os jogos do BD
fetch('/list_all')
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('boardgames-table');


        data.forEach(game => {
            let button = document.createElement('button');
            button.className = 'delete_button';
            button.onclick = function () { deleteGame(game.id, game.Nome) };
            const row = table.insertRow();
            row.insertCell().textContent = game.id;
            row.insertCell().textContent = game.Nome;
            row.insertCell().textContent = game.Publisher;
            row.insertCell().textContent = game['Tempo de Jogo'];
            row.insertCell().textContent = game['Mínimo de Jogadores'];
            row.insertCell().textContent = game['Máximo de Jogadores'];
            row.insertCell().textContent = game['Mecânica Principal'];
            row.insertCell(-1).appendChild(button);
        });
    })
    .catch(error => console.error('Error fetching data:', error))

// Cria uma função que chama a rota /boardgames/<int:id> para excluir um jogo do BD com a funçao isConfirmed para eviter que um item seja excluído por engano
function deleteGame(gameId, gameName) {
    var isConfirmed = confirm("Tem certeza que deseja excluir " + gameName + "?" );
    if (isConfirmed) {
        fetch(`/boardgames/${gameId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.reload();
            })
            .catch(error => {
                console.error('Erro ao excluir jogo:', error);
            });
    } else {
        exit;
    }
}