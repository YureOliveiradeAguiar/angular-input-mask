<p>
  A directive that allows the use of the html attribute <code>mask=""</code> and
  implements the Angular Control Value Accessor (CVA).
</p>

<h2>Supported Tokens</h2>
<table>
  <thead>
    <tr>
      <th>Token</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>N</code></td>
      <td>Numeric character (<code>0–9</code>)</td>
    </tr>
    <tr>
      <td><code>L</code></td>
      <td>Alphabetic character (<code>A–Z</code>, <code>a–z</code>)</td>
    </tr>
    <tr>
      <td><code>A</code></td>
      <td>Alphanumeric characters</td>
    </tr>
    <tr>
      <td><code>*</code></td>
      <td>Any character (N + L) (<code>A–Z</code>, <code>a–z</code>, <code>0–9</code>)</td>
    </tr>
  </tbody>
</table>

<h2>Example</h2>
<pre><code>&lt;input mask="NNN-LLLL"/&gt;</code></pre>
<ul>
  <li><strong>Mask:</strong> <code>NNN-LLLL</code></li>
  <li><strong>Input:</strong> <code>12a3BcDe</code></li>
  <li><strong>Output:</strong> <code>123-BcDe</code></li>
</ul>

<h2>Technical Details</h2>
<p>
  The use of the <strong>Control Value Accessor</strong> is needed here because
  <code>input.value</code> (DOM) does not equal <code>control.value</code> (form builder property).
  The CVA gathers the form control element value and serves this data to the reactive form properly.
</p>
