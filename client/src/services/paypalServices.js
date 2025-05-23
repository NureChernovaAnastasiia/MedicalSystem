export const loadPaypalScript = () => {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=ASeywBe0NF_wNF0UhXCjB0K2EmbgZzG_ulW6iOsVjHYS35kvCL9uEdhXxTxaFV1whFjBSYOCHuU8DhOw&currency=USD";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const renderPaypalButtons = ({
  container,
  createOrder,
  onApprove,
  onError,
  onCancel,
  style = {},
}) => {
  if (!window.paypal) {
    throw new Error('PayPal SDK not loaded');
  }
  return window.paypal.Buttons({
    style,
    createOrder,
    onApprove,
    onError,
    onCancel,
  }).render(container);
};
