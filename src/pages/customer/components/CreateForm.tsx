import {addCustomer, addRule} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProFormText, ProFormTextArea, ProFormDateRangePicker } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message, DatePicker } from 'antd';
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

  const { run, loading } = useRequest(addCustomer, {
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
          id: 'pages.searchTable.createForm.newCustomer',
          defaultMessage: 'New Activities',
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
                  id="pages.searchTable.activitiesName"
                  defaultMessage="activitie name is required"
                />
              ),
            },
          ]}
          width="md"
          name="customerName"
          label="客户名称"
        />
        <ProFormText
          width="md"
          name="companyName"
          label="公司名称"
        />
        <ProFormText
          width="md"
          name="phone"
          label="手机号"
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
        />
        <ProFormText
          width="md"
          name="address"
          label="地址"
        />
        <ProFormText
          width="md"
          name="business"
          label="行业"
        />
        <ProFormText
          width="md"
          name="sex"
          label="性别"
        />
        <ProFormTextArea width="md" name="remark" label="备注"/>
      </ModalForm>
    </>
  );
};

export default CreateForm;
