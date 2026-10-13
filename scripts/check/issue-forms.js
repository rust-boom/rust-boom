const templates = {
  ".github/ISSUE_TEMPLATE/resource.yml": {
    "name": "添加或更新 Rust 资源",
    "description": "提交资源的完整信息，供维护者审核后通过 PR 更新目录。",
    "title": "[资源] ",
    "body": [
      {
        "type": "markdown",
        "attributes": {
          "value": "请先搜索资源目录，避免重复提交。当前由维护者根据 Issue 提交 PR；自动生成 PR 将在后续接入。"
        }
      },
      {
        "type": "dropdown",
        "id": "operation",
        "attributes": {
          "label": "操作",
          "options": [
            "add",
            "update"
          ]
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "input",
        "id": "resource_id",
        "attributes": {
          "label": "资源 ID",
          "description": "新增时填写唯一小写英文 ID，例如 tokio-guide；更新时复制目录中的现有 ID。"
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "input",
        "id": "resource_title",
        "attributes": {
          "label": "资源名称"
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "dropdown",
        "id": "category",
        "attributes": {
          "label": "分类",
          "options": []
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "input",
        "id": "url",
        "attributes": {
          "label": "主链接",
          "description": "填写官网、文档或代码仓库的 HTTP(S) 链接。"
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "dropdown",
        "id": "status",
        "attributes": {
          "label": "维护状态",
          "options": [
            "unknown",
            "active",
            "archived"
          ]
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "textarea",
        "id": "body",
        "attributes": {
          "label": "资源介绍",
          "description": "填写完整的新版本介绍（Markdown），包含用途、适用场景和补充链接；不需要一级标题。"
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "textarea",
        "id": "reason",
        "attributes": {
          "label": "收录或更新依据",
          "description": "说明推荐理由、更新点；标记 active/archived 时附核验日期与证据。"
        },
        "validations": {
          "required": true
        }
      }
    ]
  },
  ".github/ISSUE_TEMPLATE/resource-link.yml": {
    "name": "给 Agent 一个链接，自动收录资源",
    "description": "只填写链接，由 Copilot 读取资料、生成中文介绍并通过 PR 添加或更新资源。",
    "title": "[链接收录] ",
    "body": [
      {
        "type": "markdown",
        "attributes": {
          "value": "只需填写资源链接。提交后由维护者将 Issue 分配给 Copilot，选择 resource-curator Agent（如可用）。Agent 会查重、分类、撰写介绍并提交 PR，合并前需要审核；提交表单本身不会自动启动 Agent。"
        }
      },
      {
        "type": "input",
        "id": "url",
        "attributes": {
          "label": "资源链接",
          "description": "官网、GitHub 仓库、文档、文章或课程的 HTTP(S) 链接。"
        },
        "validations": {
          "required": true
        }
      },
      {
        "type": "dropdown",
        "id": "operation",
        "attributes": {
          "label": "操作偏好",
          "description": "留空视为 auto：已有资源则更新，否则新增。",
          "options": [
            "auto",
            "add",
            "update"
          ]
        }
      },
      {
        "type": "input",
        "id": "resource_id",
        "attributes": {
          "label": "已有资源 ID（可选）",
          "description": "需要更新指定资源时填写；否则由 Agent 查找。"
        }
      },
      {
        "type": "textarea",
        "id": "context",
        "attributes": {
          "label": "补充要求（可选）",
          "description": "例如重点介绍适用场景、更新过时内容，或指定已有分类；可以留空。"
        }
      }
    ]
  }
};

export function issueForms(categories) {
  const forms = structuredClone(templates);
  forms['.github/ISSUE_TEMPLATE/resource.yml'].body.find(field => field.id === 'category').attributes.options = categories.map(category => category.id);
  return forms;
}
