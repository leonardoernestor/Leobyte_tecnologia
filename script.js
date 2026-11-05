document.addEventListener("DOMContentLoaded", () => {
	const chat = document.querySelector(".tech-chat");
	const panel = document.querySelector("#tech-chat-panel");
	const toggle = document.querySelector(".tech-chat-toggle");
	const close = document.querySelector(".tech-chat-close");
	const form = document.querySelector(".tech-chat-form");
	const input = document.querySelector("#tech-chat-input");
	const messages = document.querySelector("#tech-chat-messages");

	if (!chat || !panel || !toggle || !close || !form || !input || !messages) {
		throw new Error("Não foi possível iniciar o assistente de tecnologia.");
	}

	let visitorName = "";

	const normalize = (text) =>
		text
			.toLocaleLowerCase("pt-BR")
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.trim();

	const includesAny = (text, terms) => terms.some((term) => text.includes(term));

	const addMessage = (text, sender) => {
		const message = document.createElement("div");
		message.className = `tech-chat-message ${sender}`;
		message.textContent = text;
		messages.append(message);
		messages.scrollTop = messages.scrollHeight;
	};

	const answer = (message) => {
		const text = normalize(message);

		if (includesAny(text, ["oi", "ola", "bom dia", "boa tarde", "boa noite"])) {
			return `Oi${visitorName ? `, ${visitorName}` : ""}! Pode perguntar. Posso ajudar com computadores, internet, celulares, programação, sites e segurança digital.`;
		}
		if (includesAny(text, ["obrigad", "valeu", "agrade"])) {
			return "Por nada! Se surgir outra dúvida de tecnologia, pode mandar por aqui.";
		}
		if (includesAny(text, ["tchau", "ate mais", "falou"])) {
			return "Até mais! Quando quiser, é só voltar e mandar outra pergunta.";
		}
		if (includesAny(text, ["quem e voce", "o que voce faz", "seu nome"])) {
			return "Sou o assistente virtual da Leobyte. Dou orientações iniciais sobre tecnologia e também posso explicar os serviços de desenvolvimento e suporte da Leobyte.";
		}
		if (includesAny(text, ["servico", "leobyte", "orcamento", "preco", "contratar"])) {
			return "A Leobyte trabalha com criação de sites e sistemas, manutenção de computadores e orientação sobre softwares. Para conversar sobre um projeto ou orçamento, use o botão de WhatsApp na seção de contato do site.";
		}
		if (includesAny(text, ["html", "css", "javascript", "pagina", "site", "website", "wordpress", "responsivo"])) {
			return "Para criar um site, HTML organiza o conteúdo, CSS cuida do visual e JavaScript adiciona interações. Comece definindo o objetivo e o público, faça uma versão simples e teste em celulares e computadores. Se me disser o que quer construir, posso orientar melhor.";
		}
		if (includesAny(text, ["program", "codigo", "linguagem", "python", "java", "aprend"])) {
			return "Para começar a programar, escolha um objetivo pequeno e pratique os fundamentos: variáveis, condições, repetições e funções. Python costuma ser amigável para iniciantes; JavaScript é uma boa opção para páginas web. Qual projeto você gostaria de fazer?";
		}
		if (includesAny(text, ["github", "git", "repositorio", "pages"])) {
			return "Git registra as mudanças do código e GitHub hospeda repositórios para colaboração. O GitHub Pages publica sites estáticos com HTML, CSS e JavaScript; para recursos que precisam de servidor ou segredo de API, é necessário um backend separado.";
		}
		if (includesAny(text, ["wifi", "wi-fi", "internet", "roteador", "conexao"])) {
			return "Se a conexão estiver instável, reinicie o roteador, teste outro dispositivo e aproxime-se dele. Se possível, compare Wi‑Fi com cabo e verifique se a falha ocorre em todos os sites. Se continuar, anote quando acontece e fale com seu provedor.";
		}
		if (includesAny(text, ["lento", "travando", "travado", "desempenho", "memoria", "computador", "notebook", "pc"])) {
			return "Para investigar um computador lento, reinicie-o, confira o espaço livre, feche programas que não usa e observe quais aplicativos consomem CPU ou memória. Instale atualizações pelo sistema oficial e evite programas que prometem acelerar o PC sem explicar o que fazem. Qual sistema você usa e quando a lentidão começou?";
		}
		if (includesAny(text, ["virus", "malware", "hacke", "seguranca", "golpe", "phishing"])) {
			return "Mantenha o sistema e os aplicativos atualizados, use um antivírus confiável e não abra links ou anexos inesperados. Se suspeitar de invasão, desconecte o dispositivo da rede, troque senhas a partir de outro aparelho confiável e ative autenticação em dois fatores.";
		}
		if (includesAny(text, ["senha", "password", "autenticacao", "dois fatores", "2fa"])) {
			return "Use uma senha longa e exclusiva para cada serviço; um gerenciador de senhas ajuda a criá-las e guardá-las. Ative autenticação em dois fatores e nunca compartilhe códigos recebidos por SMS ou aplicativo.";
		}
		if (includesAny(text, ["celular", "smartphone", "bateria", "android", "iphone", "armazenamento"])) {
			return "No celular, confira o uso da bateria e do armazenamento nas configurações, atualize os aplicativos pela loja oficial e remova apenas arquivos que você reconhece. Evite instalar APKs ou perfis de configuração de fontes desconhecidas. Qual é o modelo e o problema?";
		}
		if (
			includesAny(text, ["inteligencia artificial", "chatgpt", "machine learning"]) ||
			text.split(/\s+/).includes("ia")
		) {
			return "Inteligência artificial reúne técnicas que identificam padrões e geram previsões ou conteúdo. Ela pode errar ou inventar informações, então confira dados importantes em fontes confiáveis e não envie informações pessoais ou sigilosas.";
		}
		if (includesAny(text, ["backup", "copia de seguranca", "recuperar arquivo", "perdi arquivo"])) {
			return "Mantenha cópias dos arquivos importantes em mais de um lugar, como um disco externo e um serviço de nuvem confiável. Faça testes de restauração e desconecte uma das cópias quando não estiver usando para reduzir o risco de ransomware.";
		}
		if (includesAny(text, ["windows", "atualizacao", "atualizar sistema"])) {
			return "Instale atualizações do Windows pelo Windows Update e mantenha espaço livre antes de atualizar. Salve seus arquivos importantes primeiro e evite baixar instaladores de sites não oficiais. Qual erro ou versão você está vendo?";
		}

		return `Ainda não tenho uma resposta específica para essa pergunta${visitorName ? `, ${visitorName}` : ""}. Posso ajudar com computadores, internet, celulares, programação, criação de sites, GitHub e segurança digital. Se puder, conte mais detalhes sobre o que você quer resolver.`;
	};

	const nameFromMessage = (message) => {
		const match = message.match(/^(?:meu nome [eé]|pode me chamar de|me chamo|sou o|sou a)\s+(.+)$/i);
		return match?.[1]?.trim();
	};

	const isLikelyName = (message) =>
		message.length <= 24 &&
		!/[?!.:,]/.test(message) &&
		message.split(/\s+/).length <= 3 &&
		!includesAny(normalize(message), [
			"como", "porque", "qual", "quais", "onde", "quando", "meu", "minha",
			"pc", "wifi", "internet", "celular", "computador", "notebook", "site",
			"program", "senha", "virus", "problema", "ajuda", "duvida", "windows",
			"github", "git", "html", "css", "javascript", "python", "java", "android",
			"iphone", "bateria", "seguranca", "inteligencia artificial", "o que", "ia",
			"oi", "ola", "bom dia", "boa tarde", "boa noite", "obrigado", "valeu",
			"sim", "nao",
		]);

	const setPanelOpen = (isOpen) => {
		panel.hidden = !isOpen;
		toggle.setAttribute("aria-expanded", String(isOpen));
		if (isOpen) {
			input.focus();
		} else {
			toggle.focus();
		}
	};

	close.addEventListener("click", () => setPanelOpen(false));
	toggle.addEventListener("click", () => setPanelOpen(panel.hidden));

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const message = input.value.trim();
		if (!message) return;

		addMessage(message, "visitor");
		input.value = "";

		if (!visitorName) {
			const name = nameFromMessage(message) ?? (isLikelyName(message) ? message : "");
			if (name) {
				visitorName = name;
				addMessage(`Prazer, ${visitorName}! Pode continuar conversando comigo e perguntar o que quiser sobre tecnologia.`, "assistant");
				input.focus();
				return;
			}
		}

		addMessage(answer(message), "assistant");
		input.focus();
	});
});
