<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../src/UserStories/Fund/LoadFund.php");

final class LoadFundTest extends TestCase
{
    public function testLoadFundWithId1()
    {
        $loadFund = new LoadFund();
        $loadFund->setId(1);

        $this->assertTrue($loadFund->run());
        $this->assertInstanceOf(Fund::class, $loadFund->getFund());
    }
}