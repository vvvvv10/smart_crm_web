import {addClue, addRule} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import { FC } from 'react';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [messageApi, contextHolder] = message.useMessage();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const { run, loading } = useRequest(addClue, {
    manual: true,
    onSuccess: () => {
      messageApi.success('Added successfully');
      reload?.();
    },
    onError: () => {
      messageApi.error('Adding failed, please try again!');
    },
  });

  return (
    <>
      {contextHolder}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.clue.newClue',
          defaultMessage: 'New rule',
        })}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>
        }
        width="400px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          await run({ data: value as API.RuleListItem });

          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="companyName"
          label={"公司名称"}
        />
        <ProFormText width="md" name="companyContactsName" label={"客户名称"}/>
        <ProFormText width="md" name="companyContactsTel" label={"电话"}/>
        <ProFormText width="md" name="companyContactsSex" label={"性别"}/>
        <ProFormText width="md" name="companyContactsEmail" label={"邮箱"}/>
        <ProFormText width="md" name="companyAddress" label={"地址"}/>
        <ProFormText width="md" name="companyContactsJobTitle" label={"职位"}/>
        <ProFormText width="md" name="clueSource" label={"线索来源"}/>
        <ProFormText width="md" name="activityId" label={"活动id"}/>
        <ProFormTextArea width="md" name="remark" label={"备注"}/>
      </ModalForm>
    </>
  );
};

export default CreateForm;
