import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

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
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.$mcj = window.jQuery.noConflict(true);
      
      // Initialize Mailchimp form
      (function($) {
        window.fnames = new Array();
        window.ftypes = new Array();
        fnames[0]='EMAIL';ftypes[0]='email';
        fnames[1]='FNAME';ftypes[1]='text';
        fnames[2]='LNAME';ftypes[2]='text';
        fnames[3]='ADDRESS';ftypes[3]='address';
        fnames[4]='PHONE';ftypes[4]='phone';
        fnames[5]='BIRTHDAY';ftypes[5]='birthday';
        fnames[6]='COMPANY';ftypes[6]='text';
      }(window.jQuery));
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
                  />
                </div>

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
                    <input
                      type="submit"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="button"
                      value="Subscribe"
                    />
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
