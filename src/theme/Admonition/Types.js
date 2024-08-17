import React from 'react';
import clsx from 'clsx';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import Translate from '@docusaurus/Translate';
import AdmonitionLayout from '@theme/Admonition/Layout';
import Admonition from '@theme/Admonition';
import IconInfo from '@theme/Admonition/Icon/Info';

const infimaClassName = 'alert alert--secondary';
const defaultProps = {
  icon: <IconInfo />,
  title: (
    <Translate
      id="theme.admonition.info"
      description="The default label used for the Info admonition (:::info)">
      info
    </Translate>
  ),
};

// function SimpleAdmonition(props) {
// console.log('Here');
// console.log(props);
//   return (
//     <AdmonitionLayout
//       {...defaultProps}
//       {...props}
//       className={clsx(infimaClassName, props.className)}>
//       {props.children}
//     </AdmonitionLayout>
//   );
// }
function SimpleAdmonition(props) {
  return (
    <Admonition type="note" title={null} icon={null} >
         {props.children}
    </Admonition>
  );
}

function AgentsAdmonition(props) {
  return (
    <Admonition type="note" title="Agents" icon='🕵️' className='admonition-agents'>
         {props.children}
    </Admonition>
  );
}

function TasksAdmonition(props) {
  return (
    <Admonition type="note" title="Tasks" icon='📝' className='admonition-tasks'>
         {props.children}
    </Admonition>
  );
}

function ChallengesAdmonition(props) {
  return (
    <Admonition type="note" title={null} icon={null} className='admonition-challenges'>
         {props.children}
    </Admonition>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,

  // Add all your custom admonition types here...
  // You can also override the default ones if you want
  'simple': SimpleAdmonition,
  'agents': AgentsAdmonition,
  'tasks': TasksAdmonition,
  'challenges': ChallengesAdmonition
};

export default AdmonitionTypes;