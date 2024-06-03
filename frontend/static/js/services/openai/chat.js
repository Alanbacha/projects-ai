const ChatApp = (() => {
	const Selectors = {
		ParentSelector: "#chatApp",
	};

	const Init = () => {
		$(Selectors.ParentSelector).find('.chat-openai').createChat();
	};

	Init();

	return {};
})();