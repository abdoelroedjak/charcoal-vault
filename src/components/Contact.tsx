import React, { useState, useId } from 'react';
import {
  TARGET_EMAIL,
  TARGET_WA_NUM,
  TARGET_WA_DISPLAY,
  PRODUCT_LABELS,
  buildMailtoUrl,
  buildWhatsAppUrl,
} from '../data/charcoalData';
import { InquiryFormData, FormStatusState } from '../types';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    business: '',
    whatsapp: '',
    email: '',
    product: '',
    quantity: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitBtnText, setSubmitBtnText] = useState('REQUEST A QUOTE VIA EMAIL');
  const [btnSuccessStyle, setBtnSuccessStyle] = useState(false);
  const [status, setStatus] = useState<FormStatusState>({
    type: null,
    message: '',
  });

  const nameId = useId();
  const businessId = useId();
  const whatsappId = useId();
  const emailId = useId();
  const productId = useId();
  const quantityId = useId();
  const messageId = useId();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const currentWaUrl = buildWhatsAppUrl(formData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus({
        type: 'error',
        message: 'Please fill in both your Name and Email address.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitBtnText('SENDING INQUIRY...');
    setStatus({ type: null, message: '' });

    const mailtoUrl = buildMailtoUrl(formData);
    const waUrl = buildWhatsAppUrl(formData);

    const isLocalFile = window.location.protocol === 'file:';

    if (isLocalFile) {
      handleLocalFallback(mailtoUrl, waUrl, false);
      return;
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Supply Inquiry — ${formData.name}${
            formData.business ? ` [${formData.business}]` : ''
          }`,
          _template: 'table',
          _captcha: 'false',
          name: formData.name,
          business: formData.business || 'N/A',
          whatsapp: formData.whatsapp || 'N/A',
          email: formData.email,
          product: PRODUCT_LABELS[formData.product] || formData.product || 'N/A',
          quantity: formData.quantity || '18 MT (MOQ)',
          message: formData.message || 'N/A',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSubmitBtnText('INQUIRY SENT TO EMAIL');
      setBtnSuccessStyle(true);
      setStatus({
        type: 'success',
        message: `Thank you, ${formData.name}. Your inquiry has been sent directly to our team. We will review and reply promptly.`,
        waUrl,
        name: formData.name,
      });

      setFormData({
        name: '',
        business: '',
        whatsapp: '',
        email: '',
        product: '',
        quantity: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitBtnText('REQUEST A QUOTE VIA EMAIL');
        setIsSubmitting(false);
        setBtnSuccessStyle(false);
      }, 7000);
    } catch {
      handleLocalFallback(mailtoUrl, waUrl, true);
    }
  };

  const handleLocalFallback = (mailtoUrl: string, waUrl: string, isFallback: boolean) => {
    setSubmitBtnText('INQUIRY READY');
    setBtnSuccessStyle(true);

    try {
      window.location.href = mailtoUrl;
    } catch (err) {
      console.warn('Mailto link navigation caught:', err);
    }

    setStatus({
      type: 'success',
      isFallback,
      message: isFallback
        ? `Automated web gateway is unavailable in this session. Your default email application has been opened with your inquiry pre-filled to ${TARGET_EMAIL}.`
        : `Your email application has been opened with your inquiry pre-filled and addressed to ${TARGET_EMAIL}. (When hosted on your live domain, submissions route automatically in the background).`,
      mailtoUrl,
      waUrl,
    });

    setFormData({
      name: '',
      business: '',
      whatsapp: '',
      email: '',
      product: '',
      quantity: '',
      message: '',
    });

    setTimeout(() => {
      setSubmitBtnText('REQUEST A QUOTE VIA EMAIL');
      setIsSubmitting(false);
      setBtnSuccessStyle(false);
    }, 4000);
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__layout">
          <div className="contact__info">
            <h2 className="contact__headline reveal">
              LET'S TALK
              <br />
              SUPPLY.
            </h2>
            <p className="contact__body reveal">
              Tell us what you need and we'll send the current product information and pricing.
            </p>

            <div className="contact__channels reveal">
              <div className="contact__channel">
                <span className="contact__channel-label">Email</span>
                <a href={`mailto:${TARGET_EMAIL}`} className="contact__channel-value">
                  {TARGET_EMAIL}
                </a>
              </div>
              <div className="contact__channel">
                <span className="contact__channel-label">WhatsApp</span>
                <a
                  href={`https://wa.me/${TARGET_WA_NUM}?text=Hello%20Charcoal%20Vault%2C%20I%20would%20like%20to%20inquire%20about%20shisha%20charcoal%20supply.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__channel-value contact__channel-wa"
                  title="Chat on WhatsApp"
                >
                  <span>{TARGET_WA_DISPLAY}</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17l9.2-9.2M17 17V8H8" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <form className="contact__form reveal" id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor={nameId} className="form-label">
                Name
              </label>
              <input
                type="text"
                id={nameId}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor={businessId} className="form-label">
                Business / Brand
              </label>
              <input
                type="text"
                id={businessId}
                name="business"
                value={formData.business}
                onChange={handleInputChange}
                className="form-input"
                autoComplete="organization"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={whatsappId} className="form-label">
                  WhatsApp / Phone
                </label>
                <input
                  type="tel"
                  id={whatsappId}
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+62 812-xxxx-xxxx"
                  autoComplete="tel"
                />
              </div>
              <div className="form-group">
                <label htmlFor={emailId} className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id={emailId}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={productId} className="form-label">
                Product Interest
              </label>
              <select
                id={productId}
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="form-input form-select"
              >
                <option value="" disabled>
                  Select a product
                </option>
                <option value="cube-charcoal">Cube Charcoal</option>
                <option value="bulk-supply">Bulk Supply</option>
                <option value="other">Other / Not sure yet</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={quantityId} className="form-label">
                Estimated Quantity
              </label>
              <input
                type="text"
                id={quantityId}
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. 18 MT (MOQ), 36 MT"
              />
            </div>
            <div className="form-group">
              <label htmlFor={messageId} className="form-label">
                Message
              </label>
              <textarea
                id={messageId}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-input form-textarea"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn--primary btn--full"
              id="submitBtn"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : btnSuccessStyle ? 1 : undefined,
                background: btnSuccessStyle ? '#1a3a22' : undefined,
                borderColor: btnSuccessStyle ? '#2d6a3f' : undefined,
              }}
            >
              {submitBtnText}
            </button>

            <div className="form-divider" aria-hidden="true">
              <span>OR</span>
            </div>

            <a
              href={currentWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--wa btn--full"
              id="directWaBtn"
              title="Chat directly with Charcoal Vault on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>CHAT ON WHATSAPP ({TARGET_WA_DISPLAY})</span>
            </a>

            {status.type && (
              <div
                className={`form-status form-status--${status.type}`}
                id="formStatus"
                aria-live="polite"
              >
                {status.type === 'error' ? (
                  status.message
                ) : (
                  <>
                    <strong>
                      ✓{' '}
                      {status.isFallback
                        ? `Inquiry Prepared for ${TARGET_EMAIL}`
                        : `Inquiry Sent to ${TARGET_EMAIL}`}
                    </strong>
                    <br />
                    {status.message}
                    <br />
                    <div className="form-status__actions">
                      {status.mailtoUrl && (
                        <a href={status.mailtoUrl} className="form-status__action-btn">
                          Open in Email ({TARGET_EMAIL})
                        </a>
                      )}
                      {status.waUrl && (
                        <a
                          href={status.waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="form-status__action-btn"
                        >
                          Chat on WhatsApp ({TARGET_WA_DISPLAY})
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
