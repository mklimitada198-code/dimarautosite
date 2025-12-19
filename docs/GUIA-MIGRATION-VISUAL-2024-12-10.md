{
  "name": "Dimar WhatsApp Bot - Corrigido",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "dimar-webhook",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [1000, 300],
      "id": "webhook-node",
      "webhookId": "e6054d99-639a-445f-8d92-ee620aeffcd9"
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict",
            "version": 1
          },
          "conditions": [
            {
              "id": "cond-eventtype",
              "leftValue": "={{ $json.body.EventType }}",
              "rightValue": "messages",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "id": "cond-not-from-me",
              "leftValue": "={{ $json.body.message.fromMe }}",
              "rightValue": false,
              "operator": {
                "type": "boolean",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "name": "Filtrar Mensagens Válidas",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1200, 300],
      "id": "filter-messages"
    },
    {
      "parameters": {
        "jsCode": "const body = $input.item.json.body || {};\nconst message = body.message || {};\nconst chat = body.chat || {};\n\nconst remoteJid = message.chatid || message.sender || chat.wa_chatid || '';\nconst number = remoteJid ? remoteJid.replace(/@.*$/, '') : '';\nconst text = (message.text || message.content || message.content?.text || message.content?.Response?.SelectedDisplayText || '').toString();\nconst buttonId = (message.buttonOrListid || message.content?.selectedButtonID || message.content?.selectedID || message.buttonId || '').toString();\nconst instance = body.instanceName || body.instance || body.Instance || '';\nconst apikey = body.token || body.apikey || '9705a3f3-0c97-4406-ac5b-cbab3f7bacf9';\nconst senderName = message.senderName || chat.name || body.chat?.wa_contactName || '';\n\nlet messageType = 'text';\nif (buttonId && buttonId.length > 0) messageType = 'button';\n\nreturn {\n  number: number,\n  chatid: remoteJid || (number + '@s.whatsapp.net'),\n  text: text,\n  buttonId: buttonId,\n  instance: instance,\n  token: apikey,\n  senderName: senderName,\n  messageType: messageType\n};"
      },
      "name": "Extrair Dados",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1400, 300],
      "id": "extract-data"
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "value",
        "key": "={{ 'dimar:cooldown:' + $json.number }}",
        "options": {}
      },
      "name": "Verificar Cooldown",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [1600, 300],
      "id": "check-cooldown"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.value !== undefined && $json.value !== null && $json.value !== '' }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Em Cooldown - BLOQUEAR"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.value === undefined || $json.value === null || $json.value === '' }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Sem Cooldown - CONTINUAR"
            }
          ]
        },
        "options": {}
      },
      "name": "Gate: Cooldown Ativo?",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [1800, 300],
      "id": "gate-cooldown"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://mkevolution.uazapi.com/send/text",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "token",
              "value": "={{ $json.token }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"number\": \"={{ $json.chatid }}\",\n  \"text\": \"⏳ Seu atendimento já foi finalizado recentemente.\\n\\nPor favor, aguarde antes de iniciar uma nova solicitação.\\n\\nSe precisar de ajuda urgente, entre em contato pelo telefone.\\n\\nObrigado pela compreensão! 😊\"\n}",
        "options": {}
      },
      "name": "Mensagem Cooldown Ativo",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [2000, 200],
      "id": "msg-cooldown-active"
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "value",
        "key": "={{ 'dimar:lock:' + $json.number }}",
        "options": {}
      },
      "name": "Verificar Lock",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [2000, 400],
      "id": "check-lock"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.value !== undefined && $json.value !== null && $json.value !== '' }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Lock Ativo - AGUARDAR"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.value === undefined || $json.value === null || $json.value === '' }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Sem Lock - PROCESSAR"
            }
          ]
        },
        "options": {}
      },
      "name": "Gate: Lock Ativo?",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [2200, 400],
      "id": "gate-lock"
    },
    {
      "parameters": {
        "operation": "set",
        "key": "={{ 'dimar:lock:' + $json.number }}",
        "value": "1",
        "expire": true,
        "ttl": 30
      },
      "name": "Criar Lock",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [2400, 500],
      "id": "create-lock"
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "value",
        "key": "={{ 'dimar:state:' + $json.number }}",
        "options": {}
      },
      "name": "Buscar Estado",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [2600, 500],
      "id": "get-state"
    },
    {
      "parameters": {
        "jsCode": "const input = $input.item.json || {};\nconst estadoRedis = input.value || null;\n\nlet estado = estadoRedis;\nif (!estado || estado === '' || estado === null) {\n  estado = 'inicio';\n}\n\nreturn { ...input, estado: estado };"
      },
      "name": "Processar Estado",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [2800, 500],
      "id": "process-state"
    },
    {
      "parameters": {
        "jsCode": "const input = $input.item.json || {};\nconst estadoAtual = input.estado || 'inicio';\nconst texto = input.text || '';\nconst messageType = input.messageType || '';\n\nlet decisao = '';\n\nif (messageType === 'button') {\n  decisao = 'botao_clicado';\n} else if ((estadoAtual === 'aguardando_carros' || estadoAtual === 'aguardando_motos') && texto.trim().length > 0) {\n  decisao = 'dados_recebidos';\n} else if (estadoAtual === 'inicio') {\n  decisao = 'menu_inicial';\n} else {\n  decisao = 'aguardando_dados';\n}\n\nreturn { ...input, estadoAtual, decisao };"
      },
      "name": "Decidir Fluxo",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [3000, 500],
      "id": "decide-flow"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.decisao }}",
                    "rightValue": "botao_clicado",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Botão Clicado"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.decisao }}",
                    "rightValue": "menu_inicial",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Menu Inicial"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.decisao }}",
                    "rightValue": "dados_recebidos",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Dados Recebidos"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.decisao }}",
                    "rightValue": "aguardando_dados",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Aguardando Dados"
            }
          ]
        },
        "options": {}
      },
      "name": "Switch Decisão",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [3200, 500],
      "id": "switch-decision"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.buttonId }}",
                    "rightValue": "carros",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Carros"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.buttonId }}",
                    "rightValue": "motos",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Motos"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.buttonId }}",
                    "rightValue": "info",
                    "operator": {
                      "type": "string",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Outras Informações"
            }
          ]
        },
        "options": {}
      },
      "name": "Switch Botão",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [3400, 300],
      "id": "switch-button"
    },
    {
      "parameters": {
        "operation": "set",
        "key": "={{ 'dimar:state:' + $json.number }}",
        "value": "aguardando_carros",
        "expire": true,
        "ttl": 600
      },
      "name": "Salvar Estado: Carros",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [3600, 200],
      "id": "save-state-cars"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://mkevolution.uazapi.com/send/text",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "token",
              "value": "={{ $json.token }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"number\": \"={{ $json.chatid }}\",\n  \"text\": \"📋 Para solicitar um orçamento de peças automotivas, por favor informe:\\n\\n• Marca do veículo\\n• Modelo\\n• Ano\\n• Peça desejada\\n\\n👉 **Envie as informações sobre o que você precisa! 😊**\"\n}",
        "options": {}
      },
      "name": "Mensagem Carros",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3800, 200],
      "id": "msg-cars"
    },
    {
      "parameters": {
        "operation": "delete",
        "key": "={{ 'dimar:lock:' + $json.number }}"
      },
      "name": "Remover Lock (Carros)",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [4000, 200],
      "id": "remove-lock-cars"
    },
    {
      "parameters": {
        "operation": "set",
        "key": "={{ 'dimar:state:' + $json.number }}",
        "value": "aguardando_motos",
        "expire": true,
        "ttl": 600
      },
      "name": "Salvar Estado: Motos",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [3600, 300],
      "id": "save-state-motos"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://mkevolution.uazapi.com/send/text",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "token",
              "value": "={{ $json.token }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"number\": \"={{ $json.chatid }}\",\n  \"text\": \"📋 Para solicitar um orçamento de peças para motos, por favor informe:\\n\\n• Marca da moto\\n• Modelo\\n• Ano\\n• Peça desejada\\n\\n👉 **Envie as informações sobre o que você precisa! 😊**\"\n}",
        "options": {}
      },
      "name": "Mensagem Motos",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3800, 300],
      "id": "msg-motos"
    },
    {
      "parameters": {
        "operation": "delete",
        "key": "={{ 'dimar:lock:' + $json.number }}"
      },
      "name": "Remover Lock (Motos)",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [4000, 300],
      "id": "remove-lock-motos"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://mkevolution.uazapi.com/send/text",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "token",
              "value": "={{ $json.token }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"number\": \"={{ $json.chatid }}\",\n  \"text\": \"😊 Tudo certo! Para agilizar o atendimento, deixe um breve resumo do que você precisa.\\n\\nNossa equipe vai responder você em breve e te ajudar da melhor forma possível!\\n\\nObrigado pela preferência pela Dimar Auto Peças e Moto Peças.\"\n}",
        "options": {}
      },
      "name": "Mensagem Outras Info",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3600, 400],
      "id": "msg-info"
    },
    {
      "parameters": {
        "operation": "delete",
        "key": "={{ 'dimar:lock:' + $json.number }}"
      },
      "name": "Remover Lock (Info)",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [3800, 400],
      "id": "remove-lock-info"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://mkevolution.uazapi.com/send/menu",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "token",
              "value": "={{ $json.token }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"number\": \"={{ $json.chatid }}\",\n  \"type\": \"button\",\n  \"text\": \"👋 Olá! Seja bem-vindo(a) à Dimar Auto Peças e Moto Peças.\\n\\nAqui você encontra peças de qualidade e atendimento dedicado para seu carro ou moto.\\n\\nComo podemos ajudar hoje?\",\n  \"choices\": [\n    \"Carros|carros\",\n    \"Motos|motos\",\n    \"Outras Informações|info\"\n  ],\n  \"footerText\": \"Por favor, selecione uma opção:\"\n}",
        "options": {}
      },
      "name": "Enviar Menu Inicial",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [3400, 500],
      "id": "send-menu"
    },
    {
      "parameters": {
        "operation": "delete",
        "key": "={{ 'dimar:lock:' + $json.number }}"
      },
      "name": "Remover Lock (Menu)",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [3600, 500],
      "id": "remove-lock-menu"
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "textoAcumulado",
        "key": "={{ 'dimar:text:' + $json.number }}",
        "options": {}
      },
      "name": "Buscar Texto Acumulado",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [3400, 700],
      "id": "get-accumulated-text"
    },
    {
      "parameters": {
        "jsCode": "const input = $input.item.json || {};\nconst textoAtual = (input.text || '').trim();\nconst textoAcumuladoRedis = (input.textoAcumulado || '');\n\nconst novoTexto = textoAcumuladoRedis ? textoAcumuladoRedis + '\\n' + textoAtual : textoAtual;\n\nreturn { ...input, textoAcumulado: novoTexto };"
      },
      "name": "Acumular Texto",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [3600, 700],
      "id": "accumulate-text"
    },
    {
      "parameters": {
        "operation": "set",
        "key": "={{ 'dimar:text:' + $json.number }}",
        "value": "={{ $json.textoAcumulado }}"
      },
      "name": "Salvar Texto Acumulado",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [3800, 700],
      "id": "save-accumulated-text"
    },
    {
      "parameters": {
        "operation": "set",
        "key": "={{ 'dimar:timeout:' + $json.number }}",
        "value": "1",
        "expire": true,
        "ttl": 120
      },
      "name": "Salvar Timeout",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [4000, 700],
      "id": "save-timeout"
    },
    {
      "parameters": {
        "amount": 15,
        "unit": "seconds"
      },
      "name": "Wait: Usuário Digitando",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [4200, 700],
      "id": "wait-typing",
      "webhookId": "a037b6a8-6f4f-4f8d-8631-d6324f76931c"
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "timeoutValue",
        "key": "={{ 'dimar:timeout:' + $json.number }}",
        "options": {}
      },
      "name": "Checar Timeout",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [4400, 700],
      "id": "check-timeout"
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.timeoutValue !== undefined && $json.timeoutValue !== null && $json.timeoutValue !== '' }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Timeout Ainda Ativo"
            },
            {
              "conditions": {
                "options": {
                  "caseSensitive": true,
                  "leftValue": "",
                  "typeValidation": "strict"
                },
                "conditions": [
                  {
                    "leftValue": "={{ $json.timeoutValue === undefined || $json.timeoutValue === null || $json.timeoutValue === '' }}",
                    "rightValue": true,
                    "operator": {
                      "type": "boolean",
                      "operation": "equals"
                    }
                  }
                ],
                "combinator": "and"
              },
              "renameOutput": true,
              "outputKey": "Timeout Expirado - FINALIZAR"
            }
          ]
        },
        "options": {}
      },
      "name": "Switch: Timeout Expirou?",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [4600, 700],
      "id": "switch-timeout"
    },
    {
      "parameters": {
        "operation": "get",
        "propertyName": "textoFinal",
        "key": "={{ 'dimar:text:' + $json.number }}",
        "options": {}
      },
      "name": "Buscar Texto Final",
      "type": "n8n-nodes-base.redis",
      "typeVersion": 1,
      "position": [4800, 800],
      "id": "get-final-text"
    },
{
  "parameters": {
    "method": "POST",
    "url": "https://mkevolution.uazapi.com/send/text",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "token",
          "value": "={{ $json.token }}"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"number\": \"={{ $json.chatid }}\",\n  \"text\": \"Recebemos suas informações! 😊\\nAguarde um instante — já estamos encaminhando para nossa equipe, e um atendente entrará em contato com você em breve.\\n\\nEnquanto isso, confira nossas redes sociais:\\n👉 Instagram: https://www.instagram.com/autopecasdimar/\"\n}",
    "options": {}
  },
  "name": "Mensagem Final",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4,
  "position": [5000, 800],
  "id": "msg-final"
}
```

### 2. Adicione os 5 nodes de finalização em sequência:

**Node 1: Salvar Cooldown**
```json
{
  "parameters": {
    "operation": "set",
    "key": "={{ 'dimar:cooldown:' + $json.number }}",
    "value": "1",
    "expire": true,
    "ttl": 7200
  },
  "name": "Salvar Cooldown",
  "type": "n8n-nodes-base.redis",
  "typeVersion": 1,
  "position": [5200, 800],
  "id": "save-cooldown"
}
```

**Node 2: Resetar Estado**
```json
{
  "parameters": {
    "operation": "delete",
    "key": "={{ 'dimar:state:' + $json.number }}"
  },
  "name": "Resetar Estado",
  "type": "n8n-nodes-base.redis",
  "typeVersion": 1,
  "position": [5400, 800],
  "id": "reset-state"
}
```

**Node 3: Resetar Texto**
```json
{
  "parameters": {
    "operation": "delete",
    "key": "={{ 'dimar:text:' + $json.number }}"
  },
  "name": "Resetar Texto",
  "type": "n8n-nodes-base.redis",
  "typeVersion": 1,
  "position": [5600, 800],
  "id": "reset-text"
}
```

**Node 4: Resetar Timeout**
```json
{
  "parameters": {
    "operation": "delete",
    "key": "={{ 'dimar:timeout:' + $json.number }}"
  },
  "name": "Resetar Timeout",
  "type": "n8n-nodes-base.redis",
  "typeVersion": 1,
  "position": [5800, 800],
  "id": "reset-timeout"
}
```

**Node 5: Remover Lock Final**
```json
{
  "parameters": {
    "operation": "delete",
    "key": "={{ 'dimar:lock:' + $json.number }}"
  },
  "name": "Remover Lock Final",
  "type": "n8n-nodes-base.redis",
  "typeVersion": 1,
  "position": [6000, 800],
  "id": "remove-lock-final"
}
```

### 3. Adicione as CONEXÕES no objeto "connections":

```json
"Buscar Texto Final": {
  "main": [[{"node": "Mensagem Final", "type": "main", "index": 0}]]
},
"Mensagem Final": {
  "main": [[{"node": "Salvar Cooldown", "type": "main", "index": 0}]]
},
"Salvar Cooldown": {
  "main": [[{"node": "Resetar Estado", "type": "main", "index": 0}]]
},
"Resetar Estado": {
  "main": [[{"node": "Resetar Texto", "type": "main", "index": 0}]]
},
"Resetar Texto": {
  "main": [[{"node": "Resetar Timeout", "type": "main", "index": 0}]]
},
"Resetar Timeout": {
  "main": [[{"node": "Remover Lock Final", "type": "main", "index": 0}]]
},
"Switch Decisão": {
  "main": [
    [{"node": "Switch Botão", "type": "main", "index": 0}],
    [{"node": "Enviar Menu Inicial", "type": "main", "index": 0}],
    [{"node": "Mensagem Final", "type": "main", "index": 0}],
    [{"node": "Buscar Texto Acumulado", "type": "main", "index": 0}]
  ]
},
"Switch: Timeout Expirou?": {
  "main": [
    [],
    [{"node": "Buscar Texto Final", "type": "main", "index": 0}]
  ]
},
"Gate: Cooldown Ativo?": {
  "main": [
    [{"node": "Mensagem Cooldown Ativo", "type": "main", "index": 0}],
    [{"node": "Verificar Lock", "type": "main", "index": 0}]
  ]
},
"Gate: Lock Ativo?": {
  "main": [
    [],
    [{"node": "Criar Lock", "type": "main", "index": 0}]
  ]
}
```
