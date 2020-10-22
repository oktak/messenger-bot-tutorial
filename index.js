'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
  res.send('hello world i am a secret bot')
})

app.get('/privacy', function (req, res) {
  res.send(`
    Privacy Policy of AI chat.

    AI chat. operates the Website Name website, which provides the SERVICE.
    
    This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Website Name website.
    
    If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
    
    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Website URL, unless otherwise defined in this Privacy Policy.
    Information Collection and Use
    
    For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.
    Log Data
    
    We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer's Internet Protocol (“IP”) address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
    Cookies
    
    Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer's hard drive.
    
    Our website uses these “cookies” to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.
    Service Providers
    
    We may employ third-party companies and individuals due to the following reasons:
    
        To facilitate our Service;
        To provide the Service on our behalf;
        To perform Service-related services; or
        To assist us in analyzing how our Service is used.
    
    We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
    Security
    
    We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
    Links to Other Sites
    
    Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
    
    Children's Privacy
    
    Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
    Changes to This Privacy Policy
    
    We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
    Contact Us
    
    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
    
    `)
})

// for facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
})

// recommended to inject access tokens as environmental variables, e.g.
const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage (sender, text) {
  const messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

// spin spin sugar
app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
})

function sendMessage (sender) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: 'First card',
          subtitle: 'Element #1 of an hscroll',
          image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
          buttons: [{
            type: 'web_url',
            url: 'https://www.messenger.com',
            title: 'web url'
          }, {
            type: 'postback',
            title: 'Postback',
            payload: 'abc'
          }]
        }, {
          title: 'Second card',
          subtitle: 'Element #2 of an hscroll',
          image_url: 'http://messengerdemo.parseapp.com/img/gearvr.png',
          buttons: [{
            type: 'postback',
            title: 'Postback',
            payload: 'abc'
          }]
        }]
      }
    }
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function sendGreetMessage (sender) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: '你想查詢以下邊一個範疇嘅資助計劃？',
          subtitle: '企業支援計劃詳情:',
          buttons: [{
            type: 'postback',
            title: '科技研發',
            payload: 'AGR'

          }, {
            type: 'postback',
            title: '醫療',
            payload: 'AGR'
          }, {
            type: 'postback',
            title: '融資及信貸保證',
            payload: 'AGR'

          }]
        }, {
          title: '你想查詢以下邊一個範疇嘅資助計劃？y',
          subtitle: '企業支援計劃詳情:',
          buttons: [{
            type: 'postback',
            title: '創意產業',
            payload: '以下係同創意產業有關嘅支援計劃： \n創意智優計劃 > http://bit.ly/2Ot3P0N \n你亦都可以點擊呢度 > http://bit.ly/399B5C0 瀏覽中小企一站通網站，以獲取其他資助計劃嘅詳情。\n初創業務\n以下係對初創企業嘅相關支援同培育計劃。'

          }]
        }]
      }
    }
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function sendGenericMessage (sender) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: '你想查詢以下邊一個範疇嘅資助計劃？',
          subtitle: '企業支援計劃詳情:',
          buttons: [{
            type: 'postback',
            title: '科技研發',
            payload: '科技研發:\n以下係同研發相關嘅資助項目：\n企業支援計劃 > http://bit.ly/371gZZa\n一般支援計劃 > http://bit.ly/31pSzHI\n實習研究員計劃 > http://bit.ly/399pe75\n 粵港科技合作資助計劃 > http://bit.ly/2OtYdn7\n 創科創投基金 > http://bit.ly/31syDUy\n院校中游研發計劃 > http://bit.ly/380cYWp\n  專利申請資助計劃 > http://bit.ly/2SmnZL1\n 博士專才庫 > http://bit.ly/380ys5s\n 公營機構試用計劃 > http://bit.ly/2UooiHI\n 投資研發現金回贈計劃 > http://bit.ly/2UmxWuF\n   大學科技初創企業資助計劃 > http://bit.ly/381mGrB\n  再工業化及科技培訓計劃 > http://bit.ly/31vYWt1\n 科技券 > http://bit.ly/2umLlYR\n\n如果你想查詢其他資助計劃嘅詳情，可以點擊呢度 > http://bit.ly/39alana 瀏覽中小企一站通網站。'

          }, {
            type: 'postback',
            title: '醫療',
            payload: '醫療\n中醫藥發展基金已經接受申請啦，詳情可以點擊呢度 > http://bit.ly/39albYg 進行瀏覽\n如果你想查詢其他資助計劃嘅詳情，可以點擊呢度 > http://bit.ly/399B5C0 瀏覽中小企一站通網站。'
          }, {
            type: 'postback',
            title: '融資及信貸保證',
            payload: '以下係同融資同信貸保證相關嘅計劃：\n出口信用保險 > http://bit.ly/2Ut0na3 \n小型貸款計劃 > http://bit.ly/2Ut5QOe \n中小企融資擔保計劃 > http://bit.ly/2uobK8P \n中小企業信貸保證計劃 > http://bit.ly/2S1iVg9 \n如果你想查詢其他資助計劃嘅詳情，可以點擊呢度 > http://bit.ly/39alana 瀏覽中小企一站通網站。'

          }]
        }, {
          title: '你想查詢以下邊一個範疇嘅資助計劃？y',
          subtitle: '企業支援計劃詳情:',
          buttons: [{
            type: 'postback',
            title: '創意產業',
            payload: '以下係同創意產業有關嘅支援計劃： \n創意智優計劃 > http://bit.ly/2Ot3P0N \n你亦都可以點擊呢度 > http://bit.ly/399B5C0 瀏覽中小企一站通網站，以獲取其他資助計劃嘅詳情。\n初創業務\n以下係對初創企業嘅相關支援同培育計劃。'

          }]
        }]
      }
    }
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.post('/webhook/', function (req, res) {
  // req 是 Facebook visit /webhook/ 帶住的 object, 裡面有很多資訊, 我們要選擇有用的來用
  // Reference:
  // "Event Format" https://developers.facebook.com/docs/messenger-platform/webhook/

  // req.body.entry[0] 表示只取第一個 entry
  const messagingEvents = req.body.entry[0].messaging

  for (let i = 0; i < messagingEvents.length; i++) {
    // for-loop 入面處理每個 message event object, 因為 messagingEvents 入面可能有好多個 message event object
    const event = req.body.entry[0].messaging[i]
    const sender = event.sender.id

    // Part 1: 檢查 message event object 係唔係有 文字 message
    if (event.message && event.message.text) {
      const text = event.message.text

      if (text === 'start') {
        // Bot 向 user 展示 First Card, Second Card
        sendMessage(sender)
      } else {
        // Echo 返 user 打咩字(最多 200 character)
        sendTextMessage(sender, text.substring(0, 200), token)
      }
    }

    // Part 2: 檢查 message event object 係唔係有 postback
    if (event.postback) {
      const valid = event.postback.payload

      if (valid === 'get_started') {
        // 由從未對展開對話, user 按 "Get Started" 之後, Facebook 會 visit /webhook/
        sendGreetMessage(sender)
      } else if (valid === 'abc') {
        // 當 Bot 展示 First Card, Second Card, user 按了 postback
        sendGenericMessage(sender)
      } else if (valid === 'AGR') {
        // 當 Bot 展示 GreetMessage 後, 按了 科技研發 或 醫療 或 融資及信貸保證
        sendTextMessage(sender, '按了 科技研發 / 醫療 / 融資及信貸保證', token)
      } else {
        // 其他有 postback 的情況
        sendTextMessage(sender, '其他有 postback 的情況', token)
      }
    }
  }

  // Facebook 要求，Facebook visit /webhook/ 都要收到由 Bot 傳回 HTTP Response Status 200
  res.sendStatus(200)
})
