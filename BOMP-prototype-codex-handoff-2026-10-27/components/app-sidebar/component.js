(function () {
  const componentStyles = new URL("component.css?v=4.5.1", document.currentScript.src).href;
  const knowledgeFolderAsset = new URL("../../pages/prototype-suite/assets/folder-1.png", document.currentScript.src).href;
  const SIDEBAR_DEFAULT_WIDTH = 220;
  const SIDEBAR_MIN_WIDTH = 220;
  const SIDEBAR_MAX_WIDTH = 420;
  const SIDEBAR_WIDTH_STORAGE_KEY = "bomp-sidebar-width";

  // DEPARTMENT_DIRECTORY_START - generated from the approved department directory workbook.
  const departmentDirectories = [
    {
      "key": "dept-architecture-management",
      "label": "架构管理",
      "count": 1,
      "children": [
        {
          "key": "dept-supply-chain-architecture",
          "label": "供应链业务架构管理",
          "count": 1
        }
      ]
    },
    {
      "key": "dept-directory-r4-l1",
      "label": "数字化需求管理",
      "count": 4,
      "children": [
        {
          "key": "dept-directory-r4-l2",
          "label": "物资业务类数字化需求管理",
          "count": 2
        },
        {
          "key": "dept-directory-r6-l2",
          "label": "经营管理类数字化需求管理",
          "count": 2
        }
      ]
    },
    {
      "key": "dept-directory-r8-l1",
      "label": "综合计划-数字化建设专业归口管理",
      "count": 7,
      "children": [
        {
          "key": "dept-directory-r8-l2",
          "label": "项目规范性管理",
          "count": 7,
          "children": [
            {
              "key": "dept-directory-r8-l3",
              "label": "相关模板",
              "count": 4
            },
            {
              "key": "dept-directory-r12-l3",
              "label": "规范性检查",
              "count": 3
            }
          ]
        }
      ]
    },
    {
      "key": "dept-directory-r15-l1",
      "label": "数字化项目建设管理",
      "count": 72,
      "children": [
        {
          "key": "dept-directory-r59-l2",
          "label": "综合计划项目",
          "count": 49,
          "children": [
            {
              "key": "dept-directory-r15-l3",
              "label": "自建系统（通过接口与IRS集成，不涉及数据重复录入问题）",
              "count": 44,
              "children": [
                {
                  "key": "dept-bomp-2025-project",
                  "label": "国网物资公司-2025年企业经营管理系统-设计开发实施项目",
                  "count": 44
                }
              ]
            },
            {
              "key": "dept-directory-r60-l3",
              "label": "统建项目",
              "count": 4,
              "children": [
                {
                  "key": "dept-directory-r60-l4",
                  "label": "xxx年xx项目",
                  "count": 4
                }
              ]
            }
          ]
        },
        {
          "key": "dept-directory-r64-l2",
          "label": "数字化相关成本事项",
          "count": 23,
          "children": [
            {
              "key": "dept-directory-r64-l3",
              "label": "项目储备",
              "count": 5
            },
            {
              "key": "dept-directory-r69-l3",
              "label": "合同文件",
              "count": 4
            },
            {
              "key": "dept-directory-r73-l3",
              "label": "人员管理",
              "count": 7
            },
            {
              "key": "dept-directory-r80-l3",
              "label": "过程管理",
              "count": 3
            },
            {
              "key": "dept-directory-r83-l3",
              "label": "验收管理",
              "count": 4
            }
          ]
        }
      ]
    },
    {
      "key": "dept-directory-r87-l1",
      "label": "非数字化项目管理（如管理研究项目、科技项目等）",
      "count": 0,
      "children": [
        {
          "key": "dept-directory-r87-l2",
          "label": "管理研究项目",
          "count": 0
        },
        {
          "key": "dept-directory-r88-l2",
          "label": "科技项目",
          "count": 0
        },
      ]
    },
    {
      "key": "dept-directory-r90-l1",
      "label": "网络安全管理",
      "count": 10,
      "children": [
        {
          "key": "dept-directory-r90-l2",
          "label": "自建信息系统网络安全等级保护",
          "count": 4,
          "children": [
            {
              "key": "dept-directory-r90-l3",
              "label": "信息系统等级保护2.0",
              "count": 4
            }
          ]
        },
        {
          "key": "dept-directory-r94-l2",
          "label": "日常监控与防护",
          "count": 3,
          "children": [
            {
              "key": "dept-directory-r94-l3",
              "label": "总部S6000系统下达工作任务、数字化部下发各类专项活动以及网络安全设备特征库升级",
              "count": 3
            }
          ]
        },
        {
          "key": "dept-directory-r97-l2",
          "label": "重大假日保障",
          "count": 3,
          "children": [
            {
              "key": "dept-directory-r97-l3",
              "label": "国家网络安全攻防演习、全国“两会”、国家节假日等期间网络及信息系统保障",
              "count": 3
            }
          ]
        }
      ]
    },
    {
      "key": "dept-directory-r100-l1",
      "label": "运维管理",
      "count": 17,
      "children": [
        {
          "key": "dept-directory-r100-l2",
          "label": "信息系统运维",
          "count": 8,
          "children": [
            {
              "key": "dept-directory-r100-l3",
              "label": "信息系统运维项目+年份+版本号",
              "count": 8
            }
          ]
        },
        {
          "key": "dept-directory-r108-l2",
          "label": "信息系统账号权限管理",
          "count": 1,
          "children": [
            {
              "key": "dept-directory-r108-l3",
              "label": "信息系统名称",
              "count": 1
            }
          ]
        },
        {
          "key": "dept-directory-r109-l2",
          "label": "信息机房管理",
          "count": 2,
          "children": [
            {
              "key": "dept-directory-r109-l3",
              "label": "信息机房管理",
              "count": 2
            }
          ]
        },
        {
          "key": "dept-directory-r111-l2",
          "label": "信息系统检修管理",
          "count": 4,
          "children": [
            {
              "key": "dept-directory-r111-l3",
              "label": "检修申请单名称+年+月",
              "count": 4
            }
          ]
        },
        {
          "key": "dept-directory-r115-l2",
          "label": "信息系统下线管理",
          "count": 2,
          "children": [
            {
              "key": "dept-directory-r115-l3",
              "label": "信息系统下线+年+月",
              "count": 2
            }
          ]
        }
      ]
    },
    {
      "key": "dept-directory-r117-l1",
      "label": "运营体系建设",
      "count": 6,
      "children": [
        {
          "key": "dept-directory-r117-l2",
          "label": "全网运营体系管理",
          "count": 2,
          "children": [
            {
              "key": "dept-directory-r117-l3",
              "label": "运营体系汇报材料",
              "count": 1
            },
            {
              "key": "dept-directory-r118-l3",
              "label": "运营体系建设",
              "count": 1
            }
          ]
        },
        {
          "key": "dept-directory-r119-l2",
          "label": "公司运营体系管理",
          "count": 4,
          "children": [
            {
              "key": "dept-directory-r119-l3",
              "label": "运营体系汇报材料",
              "count": 1
            },
            {
              "key": "dept-directory-r120-l3",
              "label": "运营体系建设",
              "count": 2
            },
            {
              "key": "dept-directory-r122-l3",
              "label": "运营人员管理",
              "count": 1
            }
          ]
        }
      ]
    },
    {
      "key": "dept-directory-r123-l1",
      "label": "供应链平台运营管理",
      "count": 6,
      "children": [
        {
          "key": "dept-directory-r123-l2",
          "label": "系统强身健体问题管理",
          "count": 3
        },
        {
          "key": "dept-directory-r126-l2",
          "label": "深化应用",
          "count": 2
        },
        {
          "key": "dept-directory-r128-l2",
          "label": "其他运营工作",
          "count": 1
        }
      ]
    },
    {
      "key": "dept-directory-r129-l1",
      "label": "人工智能运营管理",
      "count": 10,
      "children": [
        {
          "key": "dept-directory-r129-l2",
          "label": "人工智能场景建设",
          "count": 4
        },
        {
          "key": "dept-directory-r133-l2",
          "label": "人工智能场景应用",
          "count": 3
        },
        {
          "key": "dept-directory-r136-l2",
          "label": "人工智能运营体系建设",
          "count": 3
        }
      ]
    },
    {
      "key": "dept-directory-r139-l1",
      "label": "数据管理",
      "count": 11,
      "children": [
        {
          "key": "dept-directory-r139-l2",
          "label": "统建系统数据管理",
          "count": 4
        },
        {
          "key": "dept-directory-r143-l2",
          "label": "自建系统数据管理",
          "count": 7
        }
      ]
    },
    {
      "key": "dept-directory-r150-l1",
      "label": "数字化专项工作",
      "count": 9,
      "children": [
        {
          "key": "dept-directory-r150-l2",
          "label": "数字化专项工作",
          "count": 9,
          "children": [
            {
              "key": "dept-directory-r150-l3",
              "label": "供应链平台诊断分析",
              "count": 5
            },
            {
              "key": "dept-directory-r155-l3",
              "label": "“黑名单”供应商中标专项",
              "count": 4
            }
          ]
        }
      ]
    },
    {
      "key": "dept-directory-r159-l1",
      "label": "数字化工作领导小组",
      "count": 2,
      "children": [
        {
          "key": "dept-directory-r159-l2",
          "label": "会议文件",
          "count": 1
        },
        {
          "key": "dept-directory-r160-l2",
          "label": "会议纪要",
          "count": 1
        }
      ]
    },
    {
      "key": "dept-directory-r161-l1",
      "label": "综合工作",
      "count": 4,
      "children": [
        {
          "key": "dept-directory-r161-l2",
          "label": "综合管理",
          "count": 1,
          "children": [
            {
              "key": "dept-directory-r161-l3",
              "label": "工作规则",
              "count": 1
            },
            {
              "key": "dept-directory-r162-l3",
              "label": "部门周总结、月总结、年度总结",
              "count": 0
            },
            {
              "key": "dept-directory-r163-l3",
              "label": "抓落实台账",
              "count": 0
            },
            {
              "key": "dept-directory-r164-l3",
              "label": "年度重点工作任务完成情况",
              "count": 0
            }
          ]
        },
        {
          "key": "dept-directory-r165-l2",
          "label": "法律事务",
          "count": 3,
          "children": [
            {
              "key": "dept-directory-r165-l3",
              "label": "合规管理报告",
              "count": 1
            },
            {
              "key": "dept-directory-r166-l3",
              "label": "通用制度梳理",
              "count": 1
            },
            {
              "key": "dept-directory-r167-l3",
              "label": "规范性文件",
              "count": 1
            }
          ]
        },
        {
          "key": "dept-directory-r168-l2",
          "label": "党支部工作",
          "count": 0,
          "children": [
            {
              "key": "dept-directory-r168-l3",
              "label": "党建工作",
              "count": 0
            },
            {
              "key": "dept-directory-r169-l3",
              "label": "党风廉政工作",
              "count": 0
            }
          ]
        },
        {
          "key": "dept-directory-r170-l2",
          "label": "财务工作",
          "count": 0
        },
        {
          "key": "dept-directory-r171-l2",
          "label": "物资计划",
          "count": 0,
          "children": [
            {
              "key": "dept-directory-r171-l3",
              "label": "经济活动分析会材料",
              "count": 0
            }
          ]
        },
        {
          "key": "dept-directory-r172-l2",
          "label": "其他（可按需补充）",
          "count": 0
        }
      ]
    }
  ];

  window.BompDepartmentDirectoryData = departmentDirectories;
  // DEPARTMENT_DIRECTORY_END

  // COMPANY_DIRECTORY_START - generated from the approved company directory workbook.
  const companyDepartments = [
    {
      "key": "company-core-business",
      "label": "核心业务",
      "children": [
        {
          "key": "company-directory-r3-l2",
          "label": "数字化专业",
          "children": [
            {
              "key": "company-directory-r3-l3",
              "label": "架构管理",
              "children": [
                {
                  "key": "company-directory-r3-l4",
                  "label": "供应链业务架构管理"
                }
              ]
            },
            {
              "key": "company-directory-r4-l3",
              "label": "数字化需求管理",
              "children": [
                {
                  "key": "company-directory-r4-l4",
                  "label": "物资业务类数字化需求管理"
                },
                {
                  "key": "company-directory-r5-l4",
                  "label": "经营管理类数字化需求管理"
                }
              ]
            },
            {
              "key": "company-directory-r6-l3",
              "label": "综合计划-数字化建设专业归口管理",
              "children": [
                {
                  "key": "company-directory-r6-l4",
                  "label": "项目规范性管理",
                  "children": [
                    {
                      "key": "company-directory-r6-l5",
                      "label": "相关模板"
                    },
                    {
                      "key": "company-directory-r10-l5",
                      "label": "规范性检查"
                    }
                  ]
                }
              ]
            },
            {
              "key": "company-directory-r11-l3",
              "label": "运营体系建设"
            },
            {
              "key": "company-directory-r13-l3",
              "label": "供应链平台运营管理",
              "children": [
                {
                  "key": "company-directory-r13-l4",
                  "label": "系统强身健体问题管理"
                },
                {
                  "key": "company-directory-r14-l4",
                  "label": "深化应用"
                }
              ]
            },
            {
              "key": "company-directory-r15-l3",
              "label": "人工智能运营管理",
              "children": [
                {
                  "key": "company-directory-r15-l4",
                  "label": "人工智能场景建设"
                },
                {
                  "key": "company-directory-r16-l4",
                  "label": "人工智能场景应用"
                },
                {
                  "key": "company-directory-r17-l4",
                  "label": "人工智能运营体系建设"
                }
              ]
            },
            {
              "key": "company-directory-r18-l3",
              "label": "数据管理",
              "children": [
                {
                  "key": "company-directory-r18-l4",
                  "label": "统建系统数据管理"
                },
                {
                  "key": "company-directory-r19-l4",
                  "label": "自建系统数据管理"
                }
              ]
            },
            {
              "key": "company-directory-r20-l3",
              "label": "数字化专项工作",
              "children": [
                {
                  "key": "company-directory-r20-l4",
                  "label": "供应链平台诊断分析"
                },
                {
                  "key": "company-directory-r21-l4",
                  "label": "“黑名单”供应商中标专项"
                }
              ]
            },
            {
              "key": "company-directory-r22-l3",
              "label": "数字化工作领导小组",
              "children": [
                {
                  "key": "company-directory-r22-l4",
                  "label": "会议文件"
                },
                {
                  "key": "company-directory-r23-l4",
                  "label": "会议纪要"
                }
              ]
            }
          ]
        },
        {
          "key": "company-directory-r24-l2",
          "label": "招标采购专业",
          "children": [
            {
              "key": "company-directory-r24-l3",
              "label": "业务通识知识"
            },
            {
              "key": "company-directory-r25-l3",
              "label": "业务标准资料"
            },
            {
              "key": "company-directory-r26-l3",
              "label": "专项分析报告"
            }
          ]
        },
        {
          "key": "company-directory-r27-l2",
          "label": "物资供应专业",
          "children": [
            {
              "key": "company-directory-r27-l3",
              "label": "物资供应履约交流工程",
              "children": [
                {
                  "key": "company-directory-r27-l4",
                  "label": "xx工程",
                  "children": [
                    {
                      "key": "company-directory-r27-l5",
                      "label": "工程前期文件"
                    },
                    {
                      "key": "company-directory-r28-l5",
                      "label": "工程总结"
                    },
                    {
                      "key": "company-directory-r29-l5",
                      "label": "宣传资料"
                    }
                  ]
                }
              ]
            },
            {
              "key": "company-directory-r30-l3",
              "label": "物资供应履约直流工程",
              "children": [
                {
                  "key": "company-directory-r30-l4",
                  "label": "xx工程",
                  "children": [
                    {
                      "key": "company-directory-r30-l5",
                      "label": "工程前期文件"
                    },
                    {
                      "key": "company-directory-r31-l5",
                      "label": "工程总结"
                    },
                    {
                      "key": "company-directory-r32-l5",
                      "label": "宣传资料"
                    }
                  ]
                }
              ]
            },
            {
              "key": "company-directory-r33-l3",
              "label": "应急调配",
              "children": [
                {
                  "key": "company-directory-r33-l4",
                  "label": "工程统筹",
                  "children": [
                    {
                      "key": "company-directory-r33-l5",
                      "label": "监控预警"
                    },
                    {
                      "key": "company-directory-r34-l5",
                      "label": "供需分析"
                    },
                    {
                      "key": "company-directory-r35-l5",
                      "label": "统一排产"
                    }
                  ]
                },
                {
                  "key": "company-directory-r36-l4",
                  "label": "应急调配",
                  "children": [
                    {
                      "key": "company-directory-r36-l5",
                      "label": "应急物资保障"
                    }
                  ]
                }
              ]
            },
            {
              "key": "company-directory-r37-l3",
              "label": "仓储配送",
              "children": [
                {
                  "key": "company-directory-r37-l4",
                  "label": "仓储管理",
                  "children": [
                    {
                      "key": "company-directory-r37-l5",
                      "label": "公司制度"
                    },
                    {
                      "key": "company-directory-r38-l5",
                      "label": "物资部通知发文"
                    },
                    {
                      "key": "company-directory-r39-l5",
                      "label": "仓储网络优化"
                    }
                  ]
                },
                {
                  "key": "company-directory-r40-l4",
                  "label": "实物资源管理",
                  "children": [
                    {
                      "key": "company-directory-r40-l5",
                      "label": "全网实物资源监控分析及盘活消纳"
                    }
                  ]
                },
                {
                  "key": "company-directory-r41-l4",
                  "label": "物流管理",
                  "children": [
                    {
                      "key": "company-directory-r41-l5",
                      "label": "全网物流体系建设统筹管理"
                    }
                  ]
                },
                {
                  "key": "company-directory-r42-l4",
                  "label": "数智化建设",
                  "children": [
                    {
                      "key": "company-directory-r42-l5",
                      "label": "ELP平台建设运营"
                    },
                    {
                      "key": "company-directory-r43-l5",
                      "label": "ESC仓储模块建设"
                    },
                    {
                      "key": "company-directory-r44-l5",
                      "label": "全网仓储数智化建设统筹支撑"
                    }
                  ]
                }
              ]
            },
            {
              "key": "company-directory-r45-l3",
              "label": "再生资源",
              "children": [
                {
                  "key": "company-directory-r45-l4",
                  "label": "报废物资管理",
                  "children": [
                    {
                      "key": "company-directory-r45-l5",
                      "label": "报废物资处置"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "key": "company-directory-r46-l2",
          "label": "合同管理专业",
          "children": [
            {
              "key": "company-directory-r46-l3",
              "label": "总部直管工程合同签订结算管理",
              "children": [
                {
                  "key": "company-directory-r46-l4",
                  "label": "建管纲要"
                },
                {
                  "key": "company-directory-r47-l4",
                  "label": "工作方案"
                }
              ]
            },
            {
              "key": "company-directory-r48-l3",
              "label": "总部直管工程供应商管理",
              "children": [
                {
                  "key": "company-directory-r48-l4",
                  "label": "供应商服务",
                  "children": [
                    {
                      "key": "company-directory-r48-l5",
                      "label": "供应商接待日相关文件"
                    },
                    {
                      "key": "company-directory-r49-l5",
                      "label": "业务办理指南"
                    },
                    {
                      "key": "company-directory-r50-l5",
                      "label": "供应商问卷"
                    }
                  ]
                }
              ]
            },
            {
              "key": "company-directory-r51-l3",
              "label": "取费管理",
              "children": [
                {
                  "key": "company-directory-r51-l4",
                  "label": "政策性文件"
                }
              ]
            },
            {
              "key": "company-directory-r52-l3",
              "label": "全网合同管理支撑"
            }
          ]
        },
        {
          "key": "company-directory-r53-l2",
          "label": "质量监督专业",
          "children": [
            {
              "key": "company-directory-r53-l3",
              "label": "质量监督管理",
              "children": [
                {
                  "key": "company-directory-r53-l4",
                  "label": "业务规范"
                },
                {
                  "key": "company-directory-r54-l4",
                  "label": "业务解读"
                },
                {
                  "key": "company-directory-r55-l4",
                  "label": "分析报告"
                },
                {
                  "key": "company-directory-r56-l4",
                  "label": "创新研究成果"
                }
              ]
            },
            {
              "key": "company-directory-r57-l3",
              "label": "供应商关系管理",
              "children": [
                {
                  "key": "company-directory-r57-l4",
                  "label": "业务规范"
                },
                {
                  "key": "company-directory-r58-l4",
                  "label": "业务解读"
                },
                {
                  "key": "company-directory-r59-l4",
                  "label": "分析报告"
                },
                {
                  "key": "company-directory-r60-l4",
                  "label": "创新研究成果"
                }
              ]
            },
            {
              "key": "company-directory-r61-l3",
              "label": "供应商服务管理",
              "children": [
                {
                  "key": "company-directory-r61-l4",
                  "label": "业务规范"
                },
                {
                  "key": "company-directory-r62-l4",
                  "label": "业务解读"
                },
                {
                  "key": "company-directory-r63-l4",
                  "label": "分析报告"
                },
                {
                  "key": "company-directory-r64-l4",
                  "label": "创新研究成果"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "company-laws-regulations",
      "label": "法律法规",
      "children": [
        {
          "key": "company-directory-r65-l2",
          "label": "基本法律法规",
          "children": [
            {
              "key": "company-directory-r65-l3",
              "label": "宪法及宪法相关法"
            },
            {
              "key": "company-directory-r66-l3",
              "label": "立法法"
            },
            {
              "key": "company-directory-r67-l3",
              "label": "监察法"
            },
            {
              "key": "company-directory-r68-l3",
              "label": "民商法"
            },
            {
              "key": "company-directory-r69-l3",
              "label": "行政法"
            },
            {
              "key": "company-directory-r70-l3",
              "label": "刑法"
            },
            {
              "key": "company-directory-r71-l3",
              "label": "诉讼与非诉讼程序法"
            }
          ]
        },
        {
          "key": "company-directory-r72-l2",
          "label": "经营管理法律法规",
          "children": [
            {
              "key": "company-directory-r72-l3",
              "label": "公司治理"
            },
            {
              "key": "company-directory-r73-l3",
              "label": "国有资产"
            },
            {
              "key": "company-directory-r74-l3",
              "label": "财务审计"
            },
            {
              "key": "company-directory-r75-l3",
              "label": "劳动用工"
            },
            {
              "key": "company-directory-r76-l3",
              "label": "安全生产"
            },
            {
              "key": "company-directory-r77-l3",
              "label": "知识产权"
            }
          ]
        },
        {
          "key": "company-directory-r78-l2",
          "label": "主营业务法律法规",
          "children": [
            {
              "key": "company-directory-r78-l3",
              "label": "能源电力"
            },
            {
              "key": "company-directory-r79-l3",
              "label": "招标采购",
              "children": [
                {
                  "key": "company-directory-r79-l4",
                  "label": "招投标相关法律"
                },
                {
                  "key": "company-directory-r80-l4",
                  "label": "综合类"
                },
                {
                  "key": "company-directory-r81-l4",
                  "label": "招标公告"
                },
                {
                  "key": "company-directory-r82-l4",
                  "label": "评标管理"
                },
                {
                  "key": "company-directory-r83-l4",
                  "label": "资质管理"
                },
                {
                  "key": "company-directory-r84-l4",
                  "label": "投诉与监督"
                },
                {
                  "key": "company-directory-r85-l4",
                  "label": "勘察设计监理招标"
                },
                {
                  "key": "company-directory-r86-l4",
                  "label": "施工招标"
                },
                {
                  "key": "company-directory-r87-l4",
                  "label": "国内货物招标"
                },
                {
                  "key": "company-directory-r88-l4",
                  "label": "科技项目招标"
                },
                {
                  "key": "company-directory-r89-l4",
                  "label": "机电产品国际招标"
                },
                {
                  "key": "company-directory-r90-l4",
                  "label": "其他"
                }
              ]
            },
            {
              "key": "company-directory-r91-l3",
              "label": "平台运营"
            },
            {
              "key": "company-directory-r92-l3",
              "label": "信息数据"
            },
            {
              "key": "company-directory-r93-l3",
              "label": "质量监督"
            }
          ]
        },
        {
          "key": "company-directory-r94-l2",
          "label": "领导人员应知应会法律法规"
        }
      ]
    },
    {
      "key": "company-management-systems",
      "label": "管理制度",
      "children": [
        {
          "key": "company-directory-r95-l2",
          "label": "制度框架"
        },
        {
          "key": "company-directory-r96-l2",
          "label": "权责清单",
          "children": [
            {
              "key": "company-directory-r96-l3",
              "label": "公司权责事项清单"
            }
          ]
        },
        {
          "key": "company-directory-r97-l2",
          "label": "行政办公"
        },
        {
          "key": "company-directory-r98-l2",
          "label": "政策研究"
        },
        {
          "key": "company-directory-r99-l2",
          "label": "发展规划"
        },
        {
          "key": "company-directory-r100-l2",
          "label": "财务管理"
        },
        {
          "key": "company-directory-r101-l2",
          "label": "组织人事（人力资源）"
        },
        {
          "key": "company-directory-r102-l2",
          "label": "党建思政"
        },
        {
          "key": "company-directory-r103-l2",
          "label": "宣传外联"
        },
        {
          "key": "company-directory-r104-l2",
          "label": "巡视巡察"
        },
        {
          "key": "company-directory-r105-l2",
          "label": "安全监督"
        },
        {
          "key": "company-directory-r106-l2",
          "label": "科技管理"
        },
        {
          "key": "company-directory-r107-l2",
          "label": "数字化管理（业务运营）"
        },
        {
          "key": "company-directory-r108-l2",
          "label": "企业管理（体制改革）"
        },
        {
          "key": "company-directory-r109-l2",
          "label": "物资管理"
        },
        {
          "key": "company-directory-r110-l2",
          "label": "审计监督"
        },
        {
          "key": "company-directory-r111-l2",
          "label": "法律合规"
        },
        {
          "key": "company-directory-r112-l2",
          "label": "后勤管理"
        },
        {
          "key": "company-directory-r113-l2",
          "label": "离退管理"
        },
        {
          "key": "company-directory-r114-l2",
          "label": "工会管理"
        },
        {
          "key": "company-directory-r115-l2",
          "label": "纪检监督"
        },
        {
          "key": "company-directory-r116-l2",
          "label": "其他"
        }
      ]
    },
    {
      "key": "company-work-rules",
      "label": "工作规则",
      "children": [
        {
          "key": "company-directory-r117-l2",
          "label": "综合管理部",
          "children": [
            {
              "key": "company-directory-r117-l3",
              "label": "重大决策管理"
            },
            {
              "key": "company-directory-r118-l3",
              "label": "信息督察管理"
            },
            {
              "key": "company-directory-r119-l3",
              "label": "政策研究管理"
            },
            {
              "key": "company-directory-r120-l3",
              "label": "会议统筹管理"
            },
            {
              "key": "company-directory-r121-l3",
              "label": "文档保密管理"
            },
            {
              "key": "company-directory-r122-l3",
              "label": "综合事务管理"
            }
          ]
        },
        {
          "key": "company-directory-r123-l2",
          "label": "法律事务部",
          "children": [
            {
              "key": "company-directory-r123-l3",
              "label": "合规管理"
            },
            {
              "key": "company-directory-r124-l3",
              "label": "招标法律保障"
            },
            {
              "key": "company-directory-r125-l3",
              "label": "规章制度管理"
            },
            {
              "key": "company-directory-r126-l3",
              "label": "合同与授权管理"
            },
            {
              "key": "company-directory-r127-l3",
              "label": "案件管理"
            },
            {
              "key": "company-directory-r128-l3",
              "label": "法律服务"
            }
          ]
        },
        {
          "key": "company-directory-r129-l2",
          "label": "财务资产部",
          "children": [
            {
              "key": "company-directory-r129-l3",
              "label": "预算管理"
            },
            {
              "key": "company-directory-r130-l3",
              "label": "资金管理"
            },
            {
              "key": "company-directory-r131-l3",
              "label": "财税管理"
            },
            {
              "key": "company-directory-r132-l3",
              "label": "核算管理"
            },
            {
              "key": "company-directory-r133-l3",
              "label": "稽核管理"
            },
            {
              "key": "company-directory-r134-l3",
              "label": "股权管理"
            }
          ]
        },
        {
          "key": "company-directory-r135-l2",
          "label": "党委组织部",
          "children": [
            {
              "key": "company-directory-r135-l3",
              "label": "成长通道管理"
            },
            {
              "key": "company-directory-r136-l3",
              "label": "员工管理"
            },
            {
              "key": "company-directory-r137-l3",
              "label": "劳动组织管理"
            },
            {
              "key": "company-directory-r138-l3",
              "label": "薪酬福利管理"
            },
            {
              "key": "company-directory-r139-l3",
              "label": "人才培养管理"
            }
          ]
        },
        {
          "key": "company-directory-r140-l2",
          "label": "纪委办公室",
          "children": [
            {
              "key": "company-directory-r140-l3",
              "label": "审计监督工作"
            },
            {
              "key": "company-directory-r141-l3",
              "label": "廉政责任落实"
            },
            {
              "key": "company-directory-r142-l3",
              "label": "纪检监督工作"
            }
          ]
        },
        {
          "key": "company-directory-r143-l2",
          "label": "党委党建部",
          "children": [
            {
              "key": "company-directory-r143-l3",
              "label": "党委工作"
            },
            {
              "key": "company-directory-r144-l3",
              "label": "党支部工作"
            },
            {
              "key": "company-directory-r145-l3",
              "label": "工会管理"
            },
            {
              "key": "company-directory-r146-l3",
              "label": "团组织管理"
            },
            {
              "key": "company-directory-r147-l3",
              "label": "意识形态管理"
            }
          ]
        },
        {
          "key": "company-directory-r148-l2",
          "label": "离退休工作部",
          "children": [
            {
              "key": "company-directory-r148-l3",
              "label": "退休待遇落实"
            },
            {
              "key": "company-directory-r149-l3",
              "label": "离退休管理"
            }
          ]
        },
        {
          "key": "company-directory-r150-l2",
          "label": "物资计划部",
          "children": [
            {
              "key": "company-directory-r150-l3",
              "label": "经营发展管理"
            },
            {
              "key": "company-directory-r151-l3",
              "label": "管理创新"
            },
            {
              "key": "company-directory-r152-l3",
              "label": "供应链运营与监督"
            },
            {
              "key": "company-directory-r153-l3",
              "label": "物资计划管理"
            }
          ]
        },
        {
          "key": "company-directory-r154-l2",
          "label": "招标工作一部",
          "children": [
            {
              "key": "company-directory-r154-l3",
              "label": "公开招标"
            },
            {
              "key": "company-directory-r155-l3",
              "label": "非招标采购"
            }
          ]
        },
        {
          "key": "company-directory-r156-l2",
          "label": "招标工作二部",
          "children": [
            {
              "key": "company-directory-r156-l3",
              "label": "线路材料及营销类物资公开招标"
            },
            {
              "key": "company-directory-r157-l3",
              "label": "省公司采购管理支撑"
            }
          ]
        },
        {
          "key": "company-directory-r158-l2",
          "label": "招标工作三部",
          "children": [
            {
              "key": "company-directory-r158-l3",
              "label": "公开招标"
            },
            {
              "key": "company-directory-r159-l3",
              "label": "非招标采购"
            },
            {
              "key": "company-directory-r160-l3",
              "label": "采购管理支撑"
            },
            {
              "key": "company-directory-r161-l3",
              "label": "国际公开招标"
            }
          ]
        },
        {
          "key": "company-directory-r162-l2",
          "label": "合同结算部",
          "children": [
            {
              "key": "company-directory-r162-l3",
              "label": "总部直管工程合同签订结算管理"
            },
            {
              "key": "company-directory-r163-l3",
              "label": "全网合同管理支撑"
            },
            {
              "key": "company-directory-r164-l3",
              "label": "物资供应取费"
            }
          ]
        },
        {
          "key": "company-directory-r165-l2",
          "label": "物资供应部",
          "children": [
            {
              "key": "company-directory-r165-l3",
              "label": "特高压工程物资供应保障"
            },
            {
              "key": "company-directory-r166-l3",
              "label": "物资调配与应急"
            },
            {
              "key": "company-directory-r167-l3",
              "label": "仓配与再生资源管理"
            }
          ]
        },
        {
          "key": "company-directory-r168-l2",
          "label": "质量监督部",
          "children": [
            {
              "key": "company-directory-r168-l3",
              "label": "质量监督管理"
            },
            {
              "key": "company-directory-r169-l3",
              "label": "供应商关系管理"
            },
            {
              "key": "company-directory-r170-l3",
              "label": "供应商服务管理"
            }
          ]
        },
        {
          "key": "company-directory-r171-l2",
          "label": "技术支持部",
          "children": [
            {
              "key": "company-directory-r171-l3",
              "label": "评标专家管理"
            },
            {
              "key": "company-directory-r172-l3",
              "label": "资质能力核实专家管理"
            },
            {
              "key": "company-directory-r173-l3",
              "label": "物资标准化"
            },
            {
              "key": "company-directory-r174-l3",
              "label": "科技管理"
            }
          ]
        },
        {
          "key": "company-directory-r175-l2",
          "label": "供应链运营中心",
          "children": [
            {
              "key": "company-directory-r175-l3",
              "label": "数字化管理工作"
            }
          ]
        },
        {
          "key": "company-directory-r176-l2",
          "label": "综合服务中心",
          "children": [
            {
              "key": "company-directory-r176-l3",
              "label": "业务服务"
            },
            {
              "key": "company-directory-r177-l3",
              "label": "基建管理"
            },
            {
              "key": "company-directory-r178-l3",
              "label": "资产管理"
            },
            {
              "key": "company-directory-r179-l3",
              "label": "后勤管理"
            },
            {
              "key": "company-directory-r180-l3",
              "label": "安全管理"
            },
            {
              "key": "company-directory-r181-l3",
              "label": "档案管理"
            },
            {
              "key": "company-directory-r182-l3",
              "label": "采购管理"
            },
            {
              "key": "company-directory-r183-l3",
              "label": "其他物资管理"
            }
          ]
        }
      ]
    },
    {
      "key": "company-meeting-files",
      "label": "会议文件",
      "children": [
        {
          "key": "company-directory-r184-l2",
          "label": "国网会议",
          "children": [
            {
              "key": "company-directory-r184-l3",
              "label": "全局性会议",
              "children": [
                {
                  "key": "company-directory-r184-l4",
                  "label": "两会、年中会、季度会"
                }
              ]
            },
            {
              "key": "company-directory-r185-l3",
              "label": "专业性会议",
              "children": [
                {
                  "key": "company-directory-r185-l4",
                  "label": "物资专业"
                },
                {
                  "key": "company-directory-r186-l4",
                  "label": "创新工作"
                },
                {
                  "key": "company-directory-r187-l4",
                  "label": "安全生产"
                },
                {
                  "key": "company-directory-r188-l4",
                  "label": "党的建设"
                },
                {
                  "key": "company-directory-r189-l4",
                  "label": "党风廉政"
                },
                {
                  "key": "company-directory-r190-l4",
                  "label": "纪检、审计、巡视巡察"
                },
                {
                  "key": "company-directory-r191-l4",
                  "label": "法治企业建设"
                },
                {
                  "key": "company-directory-r192-l4",
                  "label": "组织人资专业"
                }
              ]
            }
          ]
        },
        {
          "key": "company-directory-r193-l2",
          "label": "公司会议",
          "children": [
            {
              "key": "company-directory-r193-l3",
              "label": "全局性会议",
              "children": [
                {
                  "key": "company-directory-r193-l4",
                  "label": "两会、年中会、季度会"
                }
              ]
            },
            {
              "key": "company-directory-r194-l3",
              "label": "专业性会议",
              "children": [
                {
                  "key": "company-directory-r194-l4",
                  "label": "创新工作"
                },
                {
                  "key": "company-directory-r195-l4",
                  "label": "安全生产"
                },
                {
                  "key": "company-directory-r196-l4",
                  "label": "党风廉政"
                },
                {
                  "key": "company-directory-r197-l4",
                  "label": "纪检、审计、巡视巡察"
                },
                {
                  "key": "company-directory-r198-l4",
                  "label": "法治企业建设"
                },
                {
                  "key": "company-directory-r199-l4",
                  "label": "组织人资专业"
                },
                {
                  "key": "company-directory-r200-l4",
                  "label": "宣传工作"
                },
                {
                  "key": "company-directory-r201-l4",
                  "label": "工会工作"
                },
                {
                  "key": "company-directory-r202-l4",
                  "label": "统一战线"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "company-training-learning",
      "label": "培训学习",
      "children": [
        {
          "key": "company-directory-r203-l2",
          "label": "政治理论教育及履职能力提升培训",
          "children": [
            {
              "key": "company-directory-r203-l3",
              "label": "思想政治教育"
            },
            {
              "key": "company-directory-r204-l3",
              "label": "履职能力提升"
            }
          ]
        },
        {
          "key": "company-directory-r205-l2",
          "label": "供应链业务培训",
          "children": [
            {
              "key": "company-directory-r205-l3",
              "label": "物资计划管理及供应链运营培训"
            },
            {
              "key": "company-directory-r206-l3",
              "label": "招标采购管理培训"
            },
            {
              "key": "company-directory-r207-l3",
              "label": "合同结算管理培训"
            },
            {
              "key": "company-directory-r208-l3",
              "label": "物资供应管理培训"
            },
            {
              "key": "company-directory-r209-l3",
              "label": "质量监督和供应商管理培训"
            },
            {
              "key": "company-directory-r210-l3",
              "label": "物资标准化管理培训"
            }
          ]
        },
        {
          "key": "company-directory-r211-l2",
          "label": "企业管理培训",
          "children": [
            {
              "key": "company-directory-r211-l3",
              "label": "企业管理培训"
            },
            {
              "key": "company-directory-r212-l3",
              "label": "基础管理培训"
            },
            {
              "key": "company-directory-r213-l3",
              "label": "法律与合规管理培训"
            },
            {
              "key": "company-directory-r214-l3",
              "label": "财务管理培训"
            },
            {
              "key": "company-directory-r215-l3",
              "label": "组织人事与人力资源管理培训"
            },
            {
              "key": "company-directory-r216-l3",
              "label": "企业文化与员工素养提升培训"
            },
            {
              "key": "company-directory-r217-l3",
              "label": "规划计划管理培训"
            },
            {
              "key": "company-directory-r218-l3",
              "label": "二级采购管理培训"
            },
            {
              "key": "company-directory-r219-l3",
              "label": "安全素养提升培训"
            }
          ]
        },
        {
          "key": "company-directory-r220-l2",
          "label": "业数融合及创新能力提升培训",
          "children": [
            {
              "key": "company-directory-r220-l3",
              "label": "数字化能力提升培训"
            },
            {
              "key": "company-directory-r221-l3",
              "label": "供应链平台运营能力提升培训"
            },
            {
              "key": "company-directory-r222-l3",
              "label": "创新能力提升培训"
            }
          ]
        },
        {
          "key": "company-directory-r223-l2",
          "label": "培训支撑保障",
          "children": [
            {
              "key": "company-directory-r223-l3",
              "label": "培训机构支撑"
            },
            {
              "key": "company-directory-r224-l3",
              "label": "培训平台支撑"
            },
            {
              "key": "company-directory-r225-l3",
              "label": "培训政策支撑"
            }
          ]
        }
      ]
    },
    {
      "key": "company-party-building",
      "label": "党的建设",
      "children": [
        {
          "key": "company-directory-r226-l2",
          "label": "基层党建"
        },
        {
          "key": "company-directory-r227-l2",
          "label": "党风廉政建设"
        }
      ]
    },
    {
      "key": "company-news-publicity",
      "label": "新闻宣传",
      "children": [
        {
          "key": "company-directory-r228-l2",
          "label": "影像资料",
          "children": [
            {
              "key": "company-directory-r228-l3",
              "label": "公司级",
              "children": [
                {
                  "key": "company-directory-r228-l4",
                  "label": "2024年之前"
                },
                {
                  "key": "company-directory-r229-l4",
                  "label": "2025年"
                },
                {
                  "key": "company-directory-r230-l4",
                  "label": "2026年"
                }
              ]
            },
            {
              "key": "company-directory-r231-l3",
              "label": "部门级",
              "children": [
                {
                  "key": "company-directory-r231-l4",
                  "label": "2024年之前"
                },
                {
                  "key": "company-directory-r232-l4",
                  "label": "2025年"
                },
                {
                  "key": "company-directory-r233-l4",
                  "label": "2026年"
                }
              ]
            }
          ]
        },
        {
          "key": "company-directory-r234-l2",
          "label": "图片资料",
          "children": [
            {
              "key": "company-directory-r234-l3",
              "label": "公司级",
              "children": [
                {
                  "key": "company-directory-r234-l4",
                  "label": "2024年之前"
                },
                {
                  "key": "company-directory-r235-l4",
                  "label": "2025年"
                },
                {
                  "key": "company-directory-r236-l4",
                  "label": "2026年"
                }
              ]
            },
            {
              "key": "company-directory-r237-l3",
              "label": "部门级",
              "children": [
                {
                  "key": "company-directory-r237-l4",
                  "label": "2024年之前"
                },
                {
                  "key": "company-directory-r238-l4",
                  "label": "2025年"
                },
                {
                  "key": "company-directory-r239-l4",
                  "label": "2026年"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "key": "company-innovation-achievements",
      "label": "创新成果",
      "children": [
        {
          "key": "company-directory-r240-l2",
          "label": "论文、论著、著作"
        },
        {
          "key": "company-directory-r241-l2",
          "label": "科技创新成果",
          "children": [
            {
              "key": "company-directory-r241-l3",
              "label": "奖项"
            },
            {
              "key": "company-directory-r242-l3",
              "label": "专利"
            },
            {
              "key": "company-directory-r243-l3",
              "label": "标准",
              "children": [
                {
                  "key": "company-directory-r243-l4",
                  "label": "采购标准"
                },
                {
                  "key": "company-directory-r244-l4",
                  "label": "物资公司公司牵头/参与标准"
                },
                {
                  "key": "company-directory-r245-l4",
                  "label": "非物资公司参与标准"
                }
              ]
            },
            {
              "key": "company-directory-r246-l3",
              "label": "科技项目成果"
            }
          ]
        },
        {
          "key": "company-directory-r247-l2",
          "label": "管理创新成果",
          "children": [
            {
              "key": "company-directory-r247-l3",
              "label": "奖项"
            },
            {
              "key": "company-directory-r248-l3",
              "label": "管理研究项目成果"
            },
            {
              "key": "company-directory-r249-l3",
              "label": "管理创新计划成果"
            },
            {
              "key": "company-directory-r250-l3",
              "label": "QC小组活动成果"
            },
            {
              "key": "company-directory-r251-l3",
              "label": "软科学课题项目成果"
            }
          ]
        },
        {
          "key": "company-directory-r252-l2",
          "label": "职工技术创新成果",
          "children": [
            {
              "key": "company-directory-r252-l3",
              "label": "奖项"
            },
            {
              "key": "company-directory-r253-l3",
              "label": "职工技术创新项目成果"
            }
          ]
        },
        {
          "key": "company-directory-r254-l2",
          "label": "“五小”创新成果",
          "children": [
            {
              "key": "company-directory-r254-l3",
              "label": "“五小”创新成果"
            }
          ]
        }
      ]
    },
    {
      "key": "company-experience-cases",
      "label": "经验案例",
      "children": [
        {
          "key": "company-directory-r255-l2",
          "label": "管理案例"
        },
        {
          "key": "company-directory-r256-l2",
          "label": "典型经验"
        }
      ]
    },
    {
      "key": "company-templates-forms",
      "label": "模板表格",
      "children": [
        {
          "key": "company-directory-r257-l2",
          "label": "会务服务"
        },
        {
          "key": "company-directory-r258-l2",
          "label": "后勤服务"
        },
        {
          "key": "company-directory-r259-l2",
          "label": "档案管理"
        },
        {
          "key": "company-directory-r260-l2",
          "label": "印章证照"
        },
        {
          "key": "company-directory-r261-l2",
          "label": "员工服务",
          "children": [
            {
              "key": "company-directory-r261-l3",
              "label": "组织人资"
            }
          ]
        },
        {
          "key": "company-directory-r262-l2",
          "label": "财务管理"
        }
      ]
    }
  ];
  // COMPANY_DIRECTORY_END

  window.BompCompanyDirectoryData = companyDepartments;

  const defaultSections = [
    {
      label: "",
      items: [
        { key: "home", label: "首页", icon: "home", href: "#home" },
        { key: "personal-library", label: "我的知识库", icon: "library", children: [
          { key: "recent-use", label: "最近使用", icon: "clock3" },
          { key: "my-knowledge", label: "我的知识", icon: "folder" },
          { key: "my-collaboration", label: "我的协作", icon: "handshake" },
          { key: "my-favorites", label: "我的收藏", icon: "star" },
          { key: "my-uploads", label: "我的上传", icon: "uploadCloud" },
          { key: "my-sharing", label: "我的共享", icon: "share" },
          { key: "my-recycle", label: "回收站", icon: "trash2" }
        ] },
        { key: "department-library", label: "部门知识库", icon: "network", children: departmentDirectories },
        { key: "company-library", label: "公司知识库", icon: "building", children: companyDepartments },
        { key: "review-workbench", label: "审核工作台", icon: "clipboardCheck", href: "review-workbench.html" },
        { key: "library-management", label: "知识库管理", icon: "fileCog", children: [
          { key: "department-library-management", label: "部门知识库管理" },
          { key: "company-library-management", label: "公司知识库管理" }
        ] },
        { key: "tag-management", label: "标签管理", icon: "tags", href: "tag-management.html" },
        { key: "system-management", label: "系统管理", icon: "settings", href: "#system-management" }
      ]
    }
  ];

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  class BompSidebar extends HTMLElement {
    static get observedAttributes() {
      return ["active"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._sections = defaultSections;
      this._expandedKeys = new Set();
      this._defaultsInitialized = false;
      this._lastExpandedActive = null;
      this._suppressAttributeRender = false;
      this._resizeMoveHandler = null;
      this._resizeEndHandler = null;
      this._resizePointerId = null;
    }

    connectedCallback() {
      this.applySidebarWidth(this.readSidebarWidth());
      this.render();
    }

    disconnectedCallback() {
      this.endSidebarResize();
    }

    attributeChangedCallback() {
      if (this.isConnected && !this._suppressAttributeRender) this.render();
    }

    set sections(value) {
      if (Array.isArray(value)) {
        this._sections = value;
        this._expandedKeys.clear();
        this._defaultsInitialized = false;
        this._lastExpandedActive = null;
        this.render();
      }
    }

    get sections() {
      return this._sections;
    }

    get items() {
      return this._sections.flatMap((section) => section.items || []);
    }

    clampSidebarWidth(width) {
      return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Math.round(Number(width) || SIDEBAR_DEFAULT_WIDTH)));
    }

    readSidebarWidth() {
      try {
        return this.clampSidebarWidth(window.sessionStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY));
      } catch (error) {
        return SIDEBAR_DEFAULT_WIDTH;
      }
    }

    applySidebarWidth(width, persist = false) {
      const nextWidth = this.clampSidebarWidth(width);
      document.documentElement.style.setProperty("--sidebar-width", `${nextWidth}px`);
      const handle = this.shadowRoot.querySelector(".sidebar-resize-handle");
      if (handle) {
        handle.setAttribute("aria-valuenow", String(nextWidth));
        handle.setAttribute("aria-valuetext", `${nextWidth} 像素`);
      }
      if (persist) {
        try {
          window.sessionStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(nextWidth));
        } catch (error) {
          // The resize remains active even when browser storage is unavailable.
        }
      }
      this.dispatchEvent(new CustomEvent("sidebar-resize", { bubbles: true, detail: { width: nextWidth } }));
      return nextWidth;
    }

    endSidebarResize() {
      if (this._resizeMoveHandler) window.removeEventListener("pointermove", this._resizeMoveHandler);
      if (this._resizeEndHandler) {
        window.removeEventListener("pointerup", this._resizeEndHandler);
        window.removeEventListener("pointercancel", this._resizeEndHandler);
      }
      const handle = this.shadowRoot.querySelector(".sidebar-resize-handle");
      if (this._resizePointerId !== null && handle?.hasPointerCapture?.(this._resizePointerId)) {
        handle.releasePointerCapture(this._resizePointerId);
      }
      this._resizeMoveHandler = null;
      this._resizeEndHandler = null;
      this._resizePointerId = null;
      document.documentElement.classList.remove("is-resizing-sidebar");
    }

    bindResizeHandle() {
      const handle = this.shadowRoot.querySelector(".sidebar-resize-handle");
      if (!handle) return;
      handle.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = this.getBoundingClientRect().width;
        this._resizePointerId = event.pointerId;
        handle.setPointerCapture?.(event.pointerId);
        document.documentElement.classList.add("is-resizing-sidebar");
        this._resizeMoveHandler = (moveEvent) => this.applySidebarWidth(startWidth + moveEvent.clientX - startX);
        this._resizeEndHandler = () => {
          this.applySidebarWidth(this.getBoundingClientRect().width, true);
          this.endSidebarResize();
          handle.focus();
        };
        window.addEventListener("pointermove", this._resizeMoveHandler);
        window.addEventListener("pointerup", this._resizeEndHandler, { once: true });
        window.addEventListener("pointercancel", this._resizeEndHandler, { once: true });
      });
      handle.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
        event.preventDefault();
        const current = this.getBoundingClientRect().width;
        const next = event.key === "Home" ? SIDEBAR_DEFAULT_WIDTH : current + (event.key === "ArrowRight" ? 20 : -20);
        this.applySidebarWidth(next, true);
      });
      handle.addEventListener("dblclick", () => this.applySidebarWidth(SIDEBAR_DEFAULT_WIDTH, true));
    }

    seedDefaultExpanded(items) {
      items.forEach((item) => {
        if (item.defaultExpanded) this._expandedKeys.add(item.key);
        if (item.children) this.seedDefaultExpanded(item.children);
      });
    }

    findPath(items, key, path = []) {
      for (const item of items) {
        const nextPath = path.concat(item);
        if (item.key === key) return nextPath;
        const found = item.children && this.findPath(item.children, key, nextPath);
        if (found) return found;
      }
      return null;
    }

    firstChild(item) {
      if (!item || !Array.isArray(item.children) || !item.children.length) return item;
      return item.children[0];
    }

    collapseExpandedBranch(item) {
      if (!item) return;
      this._expandedKeys.delete(item.key);
      item.children?.forEach((child) => this.collapseExpandedBranch(child));
    }

    ensureActivePathExpanded(active) {
      if (!this._defaultsInitialized) {
        this.seedDefaultExpanded(this.items);
        this._defaultsInitialized = true;
      }
      if (this._lastExpandedActive === active) return;
      const path = this.findPath(this.items, active) || [];
      let shallowLibrary = "";
      try {
        shallowLibrary = window.sessionStorage.getItem("bomp-sidebar-shallow-library") || "";
        window.sessionStorage.removeItem("bomp-sidebar-shallow-library");
      } catch (error) {
        shallowLibrary = "";
      }
      if (shallowLibrary && path[0]?.key === shallowLibrary) {
        path[0].children?.forEach((item) => this.collapseExpandedBranch(item));
        this._expandedKeys.add(path[0].key);
      } else {
        path.forEach((item) => {
          if (item.children && item.children.length) this._expandedKeys.add(item.key);
        });
      }
      this._lastExpandedActive = active;
    }

    renderNode(item, level, active, parentKey, activePathKeys, branchKey = "") {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const expanded = hasChildren && this._expandedKeys.has(item.key);
      const selected = item.key === active;
      const ancestorActive = !selected && activePathKeys.has(item.key);
      const currentBranchKey = level === 0 ? item.key : branchKey;
      const isKnowledgeLibraryNode = ["department-library", "company-library"].includes(currentBranchKey) && level > 0;
      const icon = isKnowledgeLibraryNode
        ? level <= 2
          ? `<span class="nav-icon knowledge-node-icon knowledge-directory-icon" aria-hidden="true">${window.BompIcons.create("library", { size: 14 })}</span>`
          : `<span class="nav-icon knowledge-node-icon knowledge-folder-icon" aria-hidden="true"><img src="${knowledgeFolderAsset}" alt=""></span>`
        : item.icon
          ? `<span class="nav-icon">${window.BompIcons.create(item.icon, { size: level === 0 ? 18 : 14 })}</span>`
          : '<span class="directory-marker" aria-hidden="true"></span>';
      const children = hasChildren
        ? `<div class="tree-children" role="group"${expanded ? "" : " hidden"}>${item.children.map((child) => this.renderNode(child, level + 1, active, item.key, activePathKeys, currentBranchKey)).join("")}</div>`
        : "";

      return `
        <div class="tree-node" role="none">
          <button class="nav-item nav-item--level-${Math.min(level, 6)}${selected ? " is-active" : ""}${ancestorActive ? " is-ancestor-active" : ""}"
             type="button"
             role="treeitem"
             data-key="${escapeHtml(item.key)}"
             data-label="${escapeHtml(item.label)}"
             data-href="${escapeHtml(item.href || `#${item.key}`)}"
             data-parent-key="${escapeHtml(parentKey || "")}"
             data-has-children="${hasChildren ? "true" : "false"}"
             title="${escapeHtml(item.label)}"
             aria-level="${level + 1}"
             ${hasChildren ? `aria-expanded="${expanded}"` : ""}
             ${selected ? 'aria-current="page"' : ""}>
            ${icon}
            <span class="nav-label">${escapeHtml(item.label)}</span>
            ${hasChildren ? `<span class="nav-chevron${expanded ? " is-expanded" : ""}" aria-hidden="true">${window.BompIcons.create("chevronRight", { size: 13 })}</span>` : ""}
          </button>
          ${children}
        </div>
      `;
    }

    setNodeExpanded(item, expanded) {
      if (!item) return;
      if (expanded) this._expandedKeys.add(item.dataset.key);
      else this._expandedKeys.delete(item.dataset.key);
      item.setAttribute("aria-expanded", String(expanded));
      item.querySelector(".nav-chevron")?.classList.toggle("is-expanded", expanded);
      const children = item.parentElement?.querySelector(":scope > .tree-children");
      if (children) children.hidden = !expanded;
    }

    toggleNode(item) {
      this.setNodeExpanded(item, !this._expandedKeys.has(item.dataset.key));
    }

    activateItem(key) {
      const path = this.findPath(this.items, key) || [];
      const activePathKeys = new Set(path.map((item) => item.key));
      path.forEach((pathItem) => {
        if (!pathItem.children?.length) return;
        const control = Array.from(this.shadowRoot.querySelectorAll(".nav-item")).find((item) => item.dataset.key === pathItem.key);
        this.setNodeExpanded(control, true);
      });
      this._suppressAttributeRender = true;
      this.setAttribute("active", key);
      this._suppressAttributeRender = false;
      this._lastExpandedActive = key;
      this.shadowRoot.querySelectorAll(".nav-item").forEach((item) => {
        const selected = item.dataset.key === key;
        item.classList.toggle("is-active", selected);
        item.classList.toggle("is-ancestor-active", !selected && activePathKeys.has(item.dataset.key));
        if (selected) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
    }

    bindEvents() {
      this.shadowRoot.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", (event) => {
          const hasChildren = item.dataset.hasChildren === "true";
          if (hasChildren && event.target.closest(".nav-chevron")) {
            this.toggleNode(item);
            return;
          }
          if (hasChildren) {
            const itemData = (this.findPath(this.items, item.dataset.key) || []).at(-1);
            if (["department-library", "company-library"].includes(item.dataset.key)) {
              const defaultTarget = this.firstChild(itemData);
              this.setNodeExpanded(item, true);
              this.activateItem(defaultTarget.key);
              const directChildren = item.parentElement?.querySelector(":scope > .tree-children");
              directChildren?.querySelectorAll(":scope > .tree-node > .nav-item[data-has-children='true']").forEach((child) => {
                this.setNodeExpanded(child, false);
              });
              this.dispatchEvent(new CustomEvent("navigation-change", {
                bubbles: true,
                detail: {
                  key: defaultTarget.key,
                  label: defaultTarget.label,
                  href: defaultTarget.href || `#${defaultTarget.key}`,
                  parentKey: item.dataset.key,
                  shallow: true
                }
              }));
              return;
            }
            if (["department-library", "company-library"].includes(item.dataset.parentKey)) {
              this.setNodeExpanded(item, true);
              this.activateItem(item.dataset.key);
              this.dispatchEvent(new CustomEvent("navigation-change", {
                bubbles: true,
                detail: {
                  key: item.dataset.key,
                  label: item.dataset.label,
                  href: item.dataset.href,
                  parentKey: item.dataset.parentKey
                }
              }));
              return;
            }
            const defaultTarget = this.firstChild(itemData);
            const targetPath = this.findPath(this.items, defaultTarget.key) || [];
            targetPath.forEach((pathItem) => {
              if (!pathItem.children?.length) return;
              const control = Array.from(this.shadowRoot.querySelectorAll(".nav-item")).find((candidate) => candidate.dataset.key === pathItem.key);
              this.setNodeExpanded(control, true);
            });
            this.activateItem(defaultTarget.key);
            this.dispatchEvent(new CustomEvent("navigation-change", {
              bubbles: true,
              detail: {
                key: defaultTarget.key,
                label: defaultTarget.label,
                href: defaultTarget.href || `#${defaultTarget.key}`,
                parentKey: item.dataset.key
              }
            }));
            return;
          }

          this.activateItem(item.dataset.key);
          this.dispatchEvent(new CustomEvent("navigation-change", {
            bubbles: true,
              detail: {
                key: item.dataset.key,
                label: item.dataset.label,
                href: item.dataset.href,
                parentKey: item.dataset.parentKey
              }
          }));
        });

        item.addEventListener("keydown", (event) => {
          const visibleItems = Array.from(this.shadowRoot.querySelectorAll(".nav-item")).filter((candidate) => candidate.offsetParent !== null);
          const index = visibleItems.indexOf(item);
          const hasChildren = item.dataset.hasChildren === "true";
          const expanded = item.getAttribute("aria-expanded") === "true";

          if (event.key === "ArrowDown" && index < visibleItems.length - 1) {
            event.preventDefault();
            visibleItems[index + 1].focus();
          } else if (event.key === "ArrowUp" && index > 0) {
            event.preventDefault();
            visibleItems[index - 1].focus();
          } else if (event.key === "ArrowRight" && hasChildren && !expanded) {
            event.preventDefault();
            this.setNodeExpanded(item, true);
          } else if (event.key === "ArrowLeft" && hasChildren && expanded) {
            event.preventDefault();
            this.setNodeExpanded(item, false);
          } else if (event.key === "ArrowLeft" && item.dataset.parentKey) {
            event.preventDefault();
            this.shadowRoot.querySelector(`[data-key="${item.dataset.parentKey}"]`)?.focus();
          }
        });
      });
    }

    render() {
      const active = this.getAttribute("active") || "home";
      this.ensureActivePathExpanded(active);
      const activePathKeys = new Set((this.findPath(this.items, active) || []).map((item) => item.key));
      const navigation = this.items.map((item) => this.renderNode(item, 0, active, "", activePathKeys, item.key)).join("");

      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${componentStyles}">
        <aside class="sidebar" aria-label="知识共享中心主导航">
          <nav class="nav-scroll" role="tree" aria-label="知识共享中心目录导航">${navigation}</nav>
          <div class="sidebar-resize-handle" role="separator" tabindex="0" aria-label="调整导航栏宽度" aria-orientation="vertical" aria-valuemin="${SIDEBAR_MIN_WIDTH}" aria-valuemax="${SIDEBAR_MAX_WIDTH}" aria-valuenow="${this.clampSidebarWidth(this.getBoundingClientRect().width)}" title="拖拽调整导航栏宽度，双击恢复默认宽度"></div>
        </aside>
      `;
      this.bindEvents();
      this.bindResizeHandle();
    }
  }

  if (!customElements.get("bomp-sidebar")) {
    customElements.define("bomp-sidebar", BompSidebar);
  }
})();
