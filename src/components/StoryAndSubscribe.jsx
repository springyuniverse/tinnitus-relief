import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Add Mailchimp CSS
const mailchimpCSS = `
  #mc_embed_signup {
    background: #fff;
    clear: left;
    font: 14px Helvetica, Arial, sans-serif;
    width: 100%;
  }
`;

const StoryAndSubscribe = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.fnames = new Array();
      window.ftypes = new Array();
      window.fnames[0] = 'EMAIL';
      window.ftypes[0] = 'email';
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Set up observers for Mailchimp response messages
    const successResponse = document.getElementById('mce-success-response');
    const errorResponse = document.getElementById('mce-error-response');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          const target = mutation.target;
          if (target.style.display !== 'none') {
            setMessage({
              type: target.id === 'mce-success-response' ? 'success' : 'error',
              text: target.textContent
            });
            setIsSubmitting(false);
          }
        }
      });
    });

    if (successResponse) {
      observer.observe(successResponse, { 
        attributes: true, 
        childList: true,
        characterData: true 
      });
    }
    if (errorResponse) {
      observer.observe(errorResponse, { 
        attributes: true, 
        childList: true,
        characterData: true 
      });
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    if (!e.target.checkValidity()) {
      return;
    }
    setIsSubmitting(true);
    setMessage({ type: '', text: 'Subscribing...' });
    
    // The form will be handled by Mailchimp's backend
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000); // Reset submitting state after 2s to ensure Mailchimp has time to process
  };

  return (
    <Card className="w-full lg:w-[400px]">
      <CardHeader>
        <CardTitle>My Tinnitus Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">A Developer's Story</h3>
          <p className="text-sm text-gray-600">
            Hi, I'm Abdul Rabie, a senior software developer specializing in health tech. My journey with tinnitus 
            began unexpectedly, and it significantly impacted my daily life. As someone who spends long hours coding 
            and problem-solving, the constant ringing in my ears was more than just a distraction—it was affecting 
            my ability to focus and find peace.
          </p>

          <p className="text-sm text-gray-600">
            The experience was challenging, but as a developer, I knew I had to channel this challenge into something 
            positive. I decided to use my technical expertise to create a solution that could help not just me, but 
            everyone struggling with tinnitus.
          </p>

          <h3 className="text-lg font-semibold">Why I Built This Tool</h3>
          <p className="text-sm text-gray-600">
            This project is more than just code—it's a personal mission to provide relief to the millions of people 
            worldwide who experience tinnitus. I've carefully crafted each feature based on scientific research and 
            personal experience, incorporating various sound therapy techniques that have helped me and many others.
          </p>

          <h3 className="text-lg font-semibold">Join Our Community</h3>
          <p className="text-sm text-gray-600">
            Subscribe to stay updated with new features, receive personalized tinnitus management tips, and be part 
            of a community that understands what you're going through. Together, we can make living with tinnitus 
            more manageable.
          </p>

          <div id="mc_embed_signup" className="mt-6">
            <style>{mailchimpCSS}</style>
            <link 
              href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" 
              rel="stylesheet" 
              type="text/css"
            />
            <form
              action="https://tinnycalm.us16.list-manage.com/subscribe/post?u=089ce47274d0173acbae3f97f&amp;id=652d5dfe1b&amp;f_id=00b91be1f0"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
            >
              <div id="mc_embed_signup_scroll" className="space-y-4">
                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    className="required email mt-1"
                    id="mce-EMAIL"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {message.text && (
                  <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                  </div>
                )}

                <div id="mce-responses" className="hidden">
                  <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
                  <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
                </div>

                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                  <input
                    type="text"
                    name="b_089ce47274d0173acbae3f97f_652d5dfe1b"
                    tabIndex="-1"
                    value=""
                    readOnly
                  />
                </div>

                <div className="optionalParent">
                  <div className="clear foot">
                    <button
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className={`button w-full transition-all duration-200 transform shadow-sm
                        ${isSubmitting 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:bg-primary/90 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] active:shadow-sm'
                        }`}
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                    <p className="mt-4 text-center">
                      <a href="http://eepurl.com/i76P5I" title="Mailchimp - email marketing made easy and fun">
                        <span className="inline-block bg-transparent rounded-lg">
                          <img 
                            className="refferal_badge" 
                            src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg" 
                            alt="Intuit Mailchimp" 
                            style={{ width: '220px', height: '40px', display: 'flex', padding: '2px 0px', justifyContent: 'center', alignItems: 'center' }}
                          />
                        </span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryAndSubscribe;
