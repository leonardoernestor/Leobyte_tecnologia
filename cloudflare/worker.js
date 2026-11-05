const SITE_ORIGIN = "https://leonardoernestor.github.io";
const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const MAX_BODY_BYTES = 12_000;
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 500;

const SYSTEM_PROMPT = `Você é o assistente virtual da Leobyte Tecnologia e conversa em português brasileiro, com educação e clareza.
Responda principalmente dúvidas sobre tecnologia, computadores, celulares, internet, programação, segurança digital e os serviços da Leobyte. Seja direto, prático e cuidadoso; não invente fatos, preços ou garantias. Se não souber, diga isso e indique o contato oficial pelo WhatsApp.
Não peça senhas, códigos de autenticação, dados bancários ou outros dados pessoais. Não solicite que o usuário execute comandos destrutivos nem desative proteções de segurança.`;

const corsHeaders = {
	"Access-Control-Allow-Origin": SITE_ORIGIN,
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Max-Age": "86400",
	"Vary": "Origin",
};

const readLimitedBody = async (request) => {
	const reader = request.body?.getReader();
	if (!reader) return "";

	const chunks = [];
	let size = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.byteLength;
		if (size > MAX_BODY_BYTES) {
			await reader.cancel();
			return null;
		}
		chunks.push(value);
	}

	const body = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder().decode(body);
};

const jsonResponse = (body, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			...corsHeaders,
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const origin = request.headers.get("Origin");

		if (origin !== SITE_ORIGIN) {
			return new Response("Origem não permitida.", { status: 403 });
		}

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders });
		}
		if (url.pathname !== "/api/chat") {
			return jsonResponse({ error: "Rota não encontrada." }, 404);
		}
		if (request.method !== "POST") {
			return jsonResponse({ error: "Método não permitido." }, 405);
		}

		const contentLength = Number(request.headers.get("Content-Length") || 0);
		if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
			return jsonResponse({ error: "A mensagem enviada é muito grande." }, 413);
		}

		let rawBody;
		try {
			rawBody = await readLimitedBody(request);
		} catch (error) {
			console.error("Falha ao ler a solicitação do chat.", error);
			return jsonResponse({ error: "Não foi possível ler a mensagem enviada." }, 400);
		}
		if (rawBody === null) {
			return jsonResponse({ error: "A mensagem enviada é muito grande." }, 413);
		}

		const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
		let rateLimit;
		try {
			rateLimit = await env.CHAT_RATE_LIMITER.limit({ key: clientIp });
		} catch (error) {
			console.error("Falha ao verificar o limite de mensagens.", error);
			return jsonResponse({ error: "O serviço de chat está indisponível. Tente novamente mais tarde." }, 503);
		}
		if (!rateLimit.success) {
			return jsonResponse({ error: "Muitas mensagens em pouco tempo. Aguarde um minuto e tente de novo." }, 429);
		}

		let payload;
		try {
			payload = JSON.parse(rawBody);
		} catch {
			return jsonResponse({ error: "O corpo da solicitação precisa ser JSON válido." }, 400);
		}

		if (!Array.isArray(payload.messages) || payload.messages.length === 0 || payload.messages.length > MAX_MESSAGES) {
			return jsonResponse({ error: "Envie entre 1 e 8 mensagens para manter a conversa." }, 400);
		}

		const messages = [];
		for (const message of payload.messages) {
			if (
				!message ||
				!["user", "assistant"].includes(message.role) ||
				typeof message.content !== "string" ||
				!message.content.trim() ||
				message.content.length > MAX_MESSAGE_LENGTH
			) {
				return jsonResponse({ error: "Uma das mensagens está vazia, inválida ou muito longa." }, 400);
			}
			messages.push({ role: message.role, content: message.content.trim() });
		}
		if (messages.at(-1).role !== "user") {
			return jsonResponse({ error: "A última mensagem precisa ser uma pergunta do usuário." }, 400);
		}

		try {
			const result = await env.AI.run(MODEL, {
				messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
				max_tokens: 300,
				temperature: 0.6,
			});
			if (typeof result.response !== "string" || !result.response.trim()) {
				console.error("Workers AI retornou uma resposta vazia ou inválida.");
				return jsonResponse({ error: "A IA não conseguiu gerar uma resposta agora." }, 502);
			}
			return jsonResponse({ reply: result.response.trim() });
		} catch (error) {
			console.error("Falha ao consultar Workers AI.", error);
			return jsonResponse({ error: "O serviço de IA está indisponível. Tente novamente mais tarde." }, 502);
		}
	},
};
